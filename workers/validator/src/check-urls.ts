/**
 * Are the URLs in a document actually reachable?
 *
 * The failure this catches: a registered feed whose every image URL carried a
 * `www.` its server does not answer on. The document validated; no client
 * could render it. A schema cannot see that, and neither can the page — from
 * a browser, a cross-origin request without CORS fails *identically* to a
 * dead host, so a client-side checker would report "broken" for half the
 * healthy web. It has to happen here.
 *
 * Three rules, and all three are the difference between a useful feature and
 * a noise machine:
 *
 * 1. **This never touches validity.** A 404 does not make a document invalid;
 *    the page shows these apart from the verdict. If a broken link could turn
 *    a feed red, publishers would start "fixing" correct feeds.
 * 2. **403 and 429 are not failures.** Meetup, Eventbrite and much of the web
 *    answer 403 to anything that smells like a bot. Reporting those as broken
 *    is exactly the false positive that was just removed from the ecosystem's
 *    daily health check. They come back as "could not check", which is not the
 *    publisher's problem and is never counted as one.
 * 3. **Budgets are hard, and the hardest one is the platform's.** A Worker
 *    invocation may make 50 subrequests, and *every* outbound call counts:
 *    each `fetch`, each DNS lookup through the DoH resolver, and — the one
 *    that is easy to forget — each Cache API call. At ~4 per URL that ceiling
 *    arrives at the eleventh, which is why this used to answer 500 for every
 *    real feed (#71). So subrequests are counted here against a budget below
 *    the platform's, DNS is resolved once per hostname rather than once per
 *    URL, and a URL that cannot be afforded comes back `skipped` — a state
 *    that is never read as "fine". Running out is a per-URL outcome, never a
 *    failed request.
 */

import { checkHost, checkUrl, type Resolver } from "./ssrf.js";

/** What one URL turned out to be. */
export type UrlState =
  /** Answered, and the answer was not an error. */
  | "ok"
  /** Nobody can fetch this: 404/410, DNS failure, connection refused. */
  | "broken"
  /**
   * Could not be established from here: 403, 429, a timeout, a 5xx. Says
   * nothing about the publisher — visually distinct from "broken", and never
   * counted as a problem.
   */
  | "unverifiable"
  /** Not attempted: the budget ran out, or the URL is one this service refuses. */
  | "skipped";

export interface UrlCheckResult {
  url: string;
  state: UrlState;
  /** HTTP status when there was one. */
  status?: number;
  /** Short, fixed vocabulary — never a remote server's own words. */
  reason: string;
}

export interface CheckLimits {
  /**
   * URLs attempted in one request. Anything beyond comes back "skipped" — and
   * a caller with a longer list is expected to send several requests, which
   * is what the page does. Kept in step with `maxSubrequests` below: a number
   * the platform cannot honour is a promise, not a limit (#71).
   */
  maxUrls: number;
  /**
   * Outbound calls this invocation may make, counting fetches, DNS lookups
   * and Cache API calls alike. The platform's ceiling is 50; this stays under
   * it so that hitting the budget is something this code decides, with an
   * answer to give, rather than something the runtime does to it mid-flight.
   */
  maxSubrequests: number;
  /** In-flight requests. Politeness towards one origin as much as a Worker limit. */
  concurrency: number;
  /** Ceiling for one URL, both attempts included. */
  perUrlTimeoutMs: number;
  /** Ceiling for the whole batch. What is left when it expires is "skipped". */
  totalBudgetMs: number;
  /** How long an answer may be reused. Short: this is a liveness check. */
  cacheTtlSeconds: number;
}

/**
 * A URL costs at least a cache lookup, a request and a cache write; a
 * hostname not seen before costs a DNS lookup on top. Starting a URL without
 * this much left would spend the budget on an answer that cannot be finished.
 */
export const MIN_SUBREQUESTS_PER_URL = 4;

export const DEFAULT_CHECK_LIMITS: CheckLimits = {
  // ~4 subrequests each against the budget below. Cached URLs cost one, so a
  // re-check of the same feed fits comfortably; a cold one is what this sizes.
  maxUrls: 12,
  // Ten under the platform's 50, so an unforeseen call cannot cross it.
  maxSubrequests: 40,
  concurrency: 6,
  perUrlTimeoutMs: 5_000,
  totalBudgetMs: 20_000,
  cacheTtlSeconds: 300,
};

/**
 * The subrequest ledger for one invocation. Every outbound call takes one,
 * and when there are none left the work stops with results in hand instead of
 * the runtime throwing "Too many subrequests" from wherever it happens to be.
 */
class SubrequestBudget {
  private remaining: number;

  constructor(total: number) {
    this.remaining = total;
  }

  /** Spends one, or returns false when the budget is gone. */
  take(): boolean {
    if (this.remaining <= 0) return false;
    this.remaining -= 1;
    return true;
  }

  get left(): number {
    return this.remaining;
  }
}

/** Thrown when the ledger is empty; turned into a `skipped` result, never a 500. */
class BudgetExhausted extends Error {
  constructor() {
    super("subrequest budget exhausted");
    this.name = "BudgetExhausted";
  }
}

const BUDGET_REASON = "not checked: this request reached its limit of outbound calls";

/**
 * Statuses that mean "the answer is about the client, not about the URL".
 * 401 is included on purpose: a login wall is a working page.
 */
const NOT_A_VERDICT = new Set([401, 403, 405, 406, 429]);

export interface CheckDeps {
  fetchImpl: typeof fetch;
  resolve: Resolver;
  limits?: Partial<CheckLimits>;
  /** Cloudflare's cache, or anything with the same two methods. Optional. */
  cache?: {
    match(request: Request): Promise<Response | undefined>;
    put(request: Request, response: Response): Promise<void>;
  };
  /** Injectable clock, so the budget is testable without waiting. */
  now?: () => number;
}

const REQUEST_HEADERS: Record<string, string> = {
  // The same anonymous, honest identity /fetch uses: no cookies, no
  // authorization, nothing about whoever asked.
  "user-agent": "OTE-Validator/0.1 (+https://validator.opentechevents.org/)",
  accept: "*/*",
};

function classifyStatus(status: number): { state: UrlState; reason: string } {
  if (status < 400) return { state: "ok", reason: `answered ${status}` };
  if (NOT_A_VERDICT.has(status)) {
    return {
      state: "unverifiable",
      // Named rather than described: 403 from a ticketing platform is the
      // single most common answer here, and it is not a defect.
      reason: `answered ${status} — this server refuses automated requests, so it could not be checked from here`,
    };
  }
  if (status >= 500) {
    return { state: "unverifiable", reason: `answered ${status} — the server is failing right now` };
  }
  return { state: "broken", reason: `answered ${status}` };
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/** Hops followed per URL. A link behind more than this is not a live link. */
const MAX_REDIRECTS = 3;

/** A refusal by the SSRF rules, which is never a verdict about the URL. */
type Refusal = { refused: string };

/**
 * One request, with every hop revalidated.
 *
 * Redirects are followed by hand for the same reason `/fetch` does it: an
 * entirely public URL that answers `302 → http://169.254.169.254/` defeats any
 * check that only ran on the URL that was submitted. `redirect: "follow"`
 * would hand that decision to the runtime.
 */
async function request(
  start: URL,
  init: RequestInit,
  deps: CheckDeps,
  limits: CheckLimits,
  deadline: number,
  now: () => number,
  budget: SubrequestBudget,
  resolve: Resolver,
): Promise<Response | Refusal> {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const host = await checkHost(current, resolve);
    if (!host.ok) {
      return host.code === "dns-failure"
        ? { refused: "dns-failure" }
        : { refused: host.message };
    }

    const remaining = Math.min(limits.perUrlTimeoutMs, deadline - now());
    if (remaining <= 0) throw new DOMException("budget spent", "TimeoutError");

    if (!budget.take()) throw new BudgetExhausted();
    const response = await deps.fetchImpl(current.toString(), {
      ...init,
      redirect: "manual",
      signal: AbortSignal.timeout(remaining),
      headers: { ...REQUEST_HEADERS, ...(init.headers as Record<string, string>) },
    });

    if (!REDIRECT_STATUSES.has(response.status)) return response;

    const location = response.headers.get("location");
    if (!location) return response;
    let next: URL;
    try {
      next = new URL(location, current);
    } catch {
      return response;
    }
    const checked = checkUrl(next.toString());
    if (!checked.ok) return { refused: checked.message };
    current = checked.url;
  }
  // More hops than any live link needs. Not called broken: it answers, it just
  // never arrives, and that is a redirect loop rather than a dead address.
  return { refused: `more than ${MAX_REDIRECTS} redirects` };
}

/**
 * One URL: `HEAD` first, then `GET` with `Range: bytes=0-0` if HEAD was
 * refused or unsupported. Plenty of servers answer 405 or 501 to HEAD, and a
 * few answer 404 to it while serving the resource perfectly on GET — treating
 * a HEAD refusal as a verdict would invent broken links.
 */
async function checkOne(
  url: string,
  deps: CheckDeps,
  limits: CheckLimits,
  deadline: number,
  now: () => number,
  budget: SubrequestBudget,
  resolve: Resolver,
): Promise<UrlCheckResult> {
  // The SSRF rules are not relaxed because the list came from a document:
  // this endpoint takes URLs from a stranger exactly like /fetch does.
  const checked = checkUrl(url);
  if (!checked.ok) return { url, state: "skipped", reason: checked.message };

  const asResult = (outcome: Refusal): UrlCheckResult =>
    // A hostname that resolves to nothing is genuinely broken for everybody;
    // anything the rules refuse is not judged at all.
    outcome.refused === "dns-failure"
      ? { url, state: "broken", reason: "that hostname does not resolve" }
      : { url, state: "skipped", reason: outcome.refused };

  try {
    const head = await request(
      checked.url,
      { method: "HEAD" },
      deps,
      limits,
      deadline,
      now,
      budget,
      resolve,
    );
    if ("refused" in head) return asResult(head);
    if (head.status < 400) {
      return { url, ...classifyStatus(head.status), status: head.status };
    }
    // Ask again properly before believing a HEAD failure — one byte of body,
    // if the server honours the range, and the headers otherwise.
    const get = await request(
      checked.url,
      { method: "GET", headers: { range: "bytes=0-0" } },
      deps,
      limits,
      deadline,
      now,
      budget,
      resolve,
    );
    if ("refused" in get) return asResult(get);
    // The body is never read: only the status matters, and leaving it
    // undrained lets the runtime drop the connection instead of downloading
    // whatever is behind the URL.
    return { url, ...classifyStatus(get.status), status: get.status };
  } catch (error) {
    // Running out of budget says nothing about the URL, so it must not look
    // like a verdict about one.
    if (error instanceof BudgetExhausted) {
      return { url, state: "skipped", reason: BUDGET_REASON };
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      return { url, state: "unverifiable", reason: "that server did not answer in time" };
    }
    // A transport failure with no status: refused connection, TLS failure,
    // a host that resolves but answers nothing. Nobody can fetch it either.
    return { url, state: "broken", reason: "that server could not be reached" };
  }
}

/** Cache key for one URL's verdict — the URL alone, never the incoming request. */
const cacheKey = (origin: string, url: string): Request =>
  new Request(`${origin}/__url-check?u=${encodeURIComponent(url)}`);

/**
 * Checks a list of URLs under every budget, with the results in the order
 * they were given.
 *
 * `origin` is only used to build cache keys — this makes no request to it.
 */
export async function checkUrls(
  urls: string[],
  origin: string,
  deps: CheckDeps,
): Promise<UrlCheckResult[]> {
  const limits = { ...DEFAULT_CHECK_LIMITS, ...deps.limits };
  const now = deps.now ?? Date.now;
  const deadline = now() + limits.totalBudgetMs;
  const budget = new SubrequestBudget(limits.maxSubrequests);

  /**
   * One DNS lookup per hostname for the whole batch, not one per URL.
   *
   * A feed's twenty URLs live on three or four hosts, and resolving each URL
   * separately spent most of the subrequest budget on answers already known —
   * which is half of why this endpoint used to fall over (#71). It is also
   * simply politer to the resolver.
   *
   * The promise is memoized, not the value: URLs of the same host run
   * concurrently, and two of them must not both go and ask.
   */
  const resolutions = new Map<string, Promise<string[]>>();
  const resolve: Resolver = (hostname) => {
    const known = resolutions.get(hostname);
    if (known) return known;
    if (!budget.take()) return Promise.reject(new BudgetExhausted());
    const pending = deps.resolve(hostname);
    resolutions.set(hostname, pending);
    // A failed lookup must not be remembered as this host's answer forever;
    // `checkHost` turns the rejection into "does not resolve" for this URL.
    pending.catch(() => resolutions.delete(hostname));
    return pending;
  };

  // Deduplicated again here: the page does it too, but this endpoint is
  // public and must not take a caller's word for it.
  const unique = [...new Set(urls)];
  const attempted = unique.slice(0, limits.maxUrls);
  const results = new Map<string, UrlCheckResult>(
    unique.slice(limits.maxUrls).map((url) => [
      url,
      {
        url,
        state: "skipped" as const,
        reason: `not checked: this endpoint checks ${limits.maxUrls} URLs per request`,
      },
    ]),
  );

  let next = 0;
  const worker = async (): Promise<void> => {
    for (;;) {
      const index = next++;
      const url = attempted[index];
      if (url === undefined) return;

      try {
        await checkNext(url);
      } catch (error) {
        // Nothing below is allowed to end the batch. Whatever went wrong with
        // one URL — including the runtime cutting a subrequest off at the
        // knees — leaves the other twenty answers standing (#71).
        results.set(url, {
          url,
          state: "skipped",
          reason:
            error instanceof BudgetExhausted
              ? BUDGET_REASON
              : "not checked: this URL could not be attempted",
        });
      }
    }
  };

  /** One URL, start to finish, writing exactly one result. */
  /** One URL, start to finish, writing exactly one result. */
  const checkNext = async (url: string): Promise<void> => {
    if (now() >= deadline) {
      results.set(url, {
        url,
        state: "skipped",
        reason: "not checked: the time budget for this batch ran out",
      });
      return;
    }

    // Refused before it starts rather than half-done: a URL needs a lookup, a
    // request and a cache write, and spending the last two subrequests on the
    // first half of that buys nothing.
    if (budget.left < MIN_SUBREQUESTS_PER_URL) {
      results.set(url, { url, state: "skipped", reason: BUDGET_REASON });
      return;
    }

    const key = cacheKey(origin, url);
    // Cache reads and writes are subrequests too — the detail that made the
    // old arithmetic wrong. A cached answer is still the cheapest outcome
    // there is: one call instead of four.
    const cached = budget.take() ? await deps.cache?.match(key) : undefined;
    if (cached) {
      results.set(url, (await cached.json()) as UrlCheckResult);
      return;
    }

    const result = await checkOne(url, deps, limits, deadline, now, budget, resolve);
    results.set(url, result);
    // Only settled answers are cached. "Skipped" says something about this
    // batch, not about the URL, and caching it would make a budget overrun
    // sticky for five minutes.
    if (result.state !== "skipped" && deps.cache && budget.take()) {
      await deps.cache.put(
        key,
        new Response(JSON.stringify(result), {
          headers: {
            "content-type": "application/json",
            "cache-control": `public, max-age=${limits.cacheTtlSeconds}`,
          },
        }),
      );
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(limits.concurrency, attempted.length) }, worker),
  );

  return unique.map(
    (url) =>
      results.get(url) ?? { url, state: "skipped", reason: "not checked" },
  );
}
