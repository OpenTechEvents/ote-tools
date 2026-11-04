/**
 * "Is anything listening there at all?" — the connect deadline, separated from
 * the download one.
 *
 * `fetch` cannot express this. One `AbortSignal` covers connect, TLS, the
 * origin thinking and the bytes moving alike, so a single budget has to be
 * large enough for the slowest legitimate origin — 60 s, see
 * `fetch-document.ts` — and a host whose SYNs are silently dropped then costs
 * a visitor that whole 60 s before anyone says so. Measured against the
 * deployed runtime: a closed-but-filtered port spends the entire budget and
 * comes back indistinguishable from a slow feed.
 *
 * A bare TCP connection separates the two in well under a second. The
 * registered feed this all started with (#70) takes 23.6 s to *answer* and
 * 0.1 s to *accept a connection*; a filtered port accepts nothing, ever. So
 * each hop opens a socket first, under a budget of its own, and only a host
 * that proved something is listening earns the long clock.
 *
 * Two things learned the hard way, both from probing the real runtime:
 *
 *  - **Probe the hostname, not the address we validated.** Connecting to an
 *    IP literal does not behave: `93.184.215.14:443` timed out at 6 s while
 *    `example.com:443` opened in 25 ms, and an IPv6 literal is refused by the
 *    runtime outright ("cannot connect to the specified address"). The SSRF
 *    checks still run on the resolved addresses before this is called, and the
 *    probe learns nothing the fetch that follows would not also learn.
 *  - **Never await `close()` on a socket that never opened.** It may not
 *    settle, and awaiting it hangs the request for longer than the budget this
 *    module exists to impose.
 */

import { connect } from "cloudflare:sockets";

/**
 * What the probe concluded.
 *
 * `inconclusive` is deliberately not a failure: see `tcpProbe`.
 */
export type ProbeOutcome = "open" | "no-connection" | "inconclusive";

export type TcpProbe = (hostname: string, port: number, budgetMs: number) => Promise<ProbeOutcome>;

/**
 * Opens a TCP connection and closes it, or gives up.
 *
 * **Fails open on purpose.** Anything other than a clean "nothing accepted a
 * connection inside the budget" comes back `inconclusive`, and the caller
 * proceeds to the real fetch as if no probe had run. A probe is an
 * optimization on the clock, not a second opinion about whether a feed exists:
 * it may shorten a hopeless wait, and it must never be able to invent a
 * failure for a feed that would have loaded. The runtime refusing to connect
 * to some address shape is exactly the case that would otherwise turn a
 * working feed unreachable.
 */
export const tcpProbe: TcpProbe = async (hostname, port, budgetMs) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const socket = connect({ hostname, port });
    const outcome = await Promise.race<ProbeOutcome>([
      socket.opened.then<ProbeOutcome, ProbeOutcome>(
        () => "open",
        // A refusal (RST) is not reported as `no-connection`: the fetch that
        // follows fails on it just as fast, with a better message.
        () => "inconclusive",
      ),
      new Promise<ProbeOutcome>((resolve) => {
        timer = setTimeout(() => resolve("no-connection"), budgetMs);
      }),
    ]);
    // Not awaited: closing a socket that never opened may never settle.
    void socket.close().catch(() => {});
    return outcome;
  } catch {
    return "inconclusive";
  } finally {
    if (timer) clearTimeout(timer);
  }
};
