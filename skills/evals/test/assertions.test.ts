import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  absentField,
  appendedEvent,
  idFollowsSiblings,
  wroteNoSecondFeed,
  claimedValidityWithoutProof,
  commandLacks,
  groupedQuestions,
  idPreserved,
  maxFields,
  noInventedFields,
  noticedExistingFeed,
  ranImporter,
  ranValidator,
  slugUnchanged,
  wroteNoEventFile,
} from "../src/assertions.js";
import { fixturesDir } from "../src/setup.js";
import type { Run, Turn } from "../src/transcript.js";

/**
 * The assertions are unit-tested without an agent on purpose: they are the
 * measuring instrument, and an instrument nobody calibrated turns a skill
 * regression into a green run. Every `Run` here is written by hand.
 */
const run = (turns: Turn[]): Run => ({ skillsLoaded: ["ote-event"], turns, dir: "/tmp/nowhere" });

const bash = (command: string, output?: string): Turn => ({
  role: "tool",
  tool: { name: "bash", command },
  ...(output ? { output } : {}),
});
const says = (text: string): Turn => ({ role: "assistant", text });
const writes = (path: string): Turn => ({ role: "tool", tool: { name: "write", path } });

describe("ranValidator / ranImporter", () => {
  it("pass on the npx forms the skill actually prescribes", () => {
    const r = run([
      bash('curl -sL "https://x.example" | npx -y -p @opentechevents/import-jsonld@0.6 ote-import-jsonld -'),
      bash("npx -y -p @opentechevents/validate@0.6 ote-validate events/x.json"),
    ]);
    expect(ranValidator(r).passed).toBe(true);
    expect(ranImporter(r).passed).toBe(true);
  });

  it("require the fork's own gate when the repo is a kit fork", () => {
    const built = run([bash("npx -y -p @opentechevents/build-feed@0.6 ote-build-feed . --check")]);
    expect(ranValidator(built, "fork").passed).toBe(true);
    // The command without --check builds the feed; it does not judge it.
    expect(ranValidator(run([bash("ote-build-feed .")]), "fork").passed).toBe(false);
    expect(ranValidator(run([bash("ote-validate events/")]), "fork").passed).toBe(false);
  });

  it("catch every spelling that reaches the members in a fork", () => {
    const wrong = [
      "ote-validate events/",
      "ote-validate events",
      "npx -y -p @opentechevents/validate@0.6 ote-validate ./events",
      "ote-validate events/2026-11-07-biznagafest.json",
      "ote-validate .",
      "ote-validate --spec-version 0.6.0 .",
      "cd events && ote-validate .",
      "find events -name '*.json' | xargs ote-validate",
      "ote-validate 'events'",
      "ote-validate events/*.json",
      "for f in events/*.json; do ote-validate $f; done",
      "pushd events && ote-validate .",
    ];
    for (const command of wrong) {
      const r = run([bash("ote-build-feed . --check"), bash(command)]);
      expect(ranValidator(r, "fork").passed, command).toBe(false);
    }
  });

  it("leave legitimate paths alone, even ones with the word in them", () => {
    const fine = [
      "ote-validate events.json",
      "ote-validate my-events/",
      "ote-validate /tmp/their-events/feed.json",
      "ote-validate public/events/feed.json",
      // Compound lines: the arguments of the invocation decide, not the rest
      // of the shell. Reading a member and then judging the assembled feed is
      // a correct sequence in a fork, and a draft that scanned the whole line
      // called it the failure.
      "cat events/x.json && ote-validate events.json",
      "ote-validate events.json && ls events/",
      "ote-validate events.json; ls -la events/",
      "ote-validate feed.json | grep -c events/",
      "ote-validate feed.json  # members live in events/",
      "for f in feeds/*.json; do ote-validate $f; done",
    ];
    for (const command of fine) {
      const r = run([bash("ote-build-feed . --check"), bash(command)]);
      expect(ranValidator(r, "fork").passed, command).toBe(true);
    }
  });

  it("fail a fork run that pointed the validator at the feed members anyway", () => {
    const both = run([
      bash("ote-validate events/2026-11-07-biznagafest.json"),
      bash("ote-build-feed . --check"),
    ]);
    const c = ranValidator(both, "fork");
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("judged feed members standalone");
  });

  it("still accept validating the assembled feed in a fork", () => {
    const r = run([bash("ote-build-feed . --check"), bash("ote-validate events.json")]);
    expect(ranValidator(r, "fork").passed).toBe(true);
  });

  it("keep meaning ote-validate for a standalone document", () => {
    expect(ranValidator(run([bash("ote-validate feed.json")])).passed).toBe(true);
    expect(ranValidator(run([bash("ote-build-feed . --check")])).passed).toBe(false);
  });

  it("fail when the agent only talked about validating", () => {
    const r = run([says("I validated it against the schema and it is valid.")]);
    expect(ranValidator(r).passed).toBe(false);
  });
});

describe("claimedValidityWithoutProof", () => {
  it("catches the verdict that arrives before the evidence", () => {
    const r = run([says("This is valid OTE."), bash("ote-validate events/x.json")]);
    expect(claimedValidityWithoutProof(r).passed).toBe(false);
  });

  it("allows the verdict after the validator ran", () => {
    const r = run([bash("ote-validate events/x.json", "1/1 valid"), says("The validator says it is valid.")]);
    expect(claimedValidityWithoutProof(r).passed).toBe(true);
  });
});

describe("groupedQuestions", () => {
  it("passes on one grouped question before the write", () => {
    const r = run([says("Two things the page could not say: timezone? license?"), writes("events/x.json")]);
    expect(groupedQuestions(r, 2).passed).toBe(true);
  });

  it("fails on a field-by-field interrogation", () => {
    const r = run([
      says("What timezone?"),
      says("And the license?"),
      says("Is it in person?"),
      writes("events/x.json"),
    ]);
    const check = groupedQuestions(r, 2);
    expect(check.passed).toBe(false);
    expect(check.detail).toContain("3 question turns");
  });

  it("counts only the questions before the first write", () => {
    const r = run([says("Timezone and license?"), writes("events/x.json"), says("Shall I commit?")]);
    expect(groupedQuestions(r, 2).passed).toBe(true);
  });
});

describe("the invariants that break consumers", () => {
  it("idPreserved fails when the id moved", () => {
    expect(idPreserved("https://x.example/events/a", "https://x.example/events/b").passed).toBe(false);
    expect(idPreserved("https://x.example/events/a", "https://x.example/events/a").passed).toBe(true);
  });

  it("slugUnchanged fails when a tidy-up renamed the file", () => {
    const check = slugUnchanged(["events/2026-11-07-x.json"], ["events/2026-11-14-x.json"]);
    expect(check.passed).toBe(false);
    expect(check.detail).toContain("2026-11-07");
  });
});

describe("noInventedFields", () => {
  it("passes when every field traces back to the source or the organizer", () => {
    const written = { specVersion: "0.4.0", id: "x", name: "y", startDate: "2026-11-07T09:00", timezone: "Europe/Madrid" };
    const check = noInventedFields(written, {
      fromSource: ["name", "startDate"],
      confirmed: ["id", "timezone"],
    });
    expect(check.passed).toBe(true);
  });

  it("catches the fields no importer can produce", () => {
    const written = { name: "y", offers: [{ price: 0 }], eligibility: "open" };
    const check = noInventedFields(written, { fromSource: ["name"], confirmed: [] });
    expect(check.passed).toBe(false);
    expect(check.detail).toContain("offers");
    expect(check.detail).toContain("eligibility");
  });
});

describe("the private-calendar email rule", () => {
  it("absentField walks into arrays with []", () => {
    const withEmail = { organizers: [{ name: "Rust Madrid", email: "hola@rustmadrid.example" }] };
    const without = { organizers: [{ name: "Rust Madrid" }] };
    expect(absentField(withEmail, "organizers[].email").passed).toBe(false);
    expect(absentField(without, "organizers[].email").passed).toBe(true);
  });

  it("commandLacks matches whole flags, not substrings", () => {
    expect(commandLacks(run([bash("ote-import-ics --public cal.ics")]), "--public").passed).toBe(false);
    expect(commandLacks(run([bash("ote-import-ics --tz Europe/Madrid cal.ics")]), "--public").passed).toBe(true);
    expect(commandLacks(run([bash("ote-import-ics --publicate cal.ics")]), "--public").passed).toBe(true);
  });
});

describe("noticedExistingFeed", () => {
  const feed = "https://eventos.wiki/organizations/gdg-malaga/events.json";

  it("counts the feed appearing in prose, in tool output, or in a command", () => {
    expect(noticedExistingFeed(run([says(`the page declares ${feed}`)]), feed).passed).toBe(true);
    expect(noticedExistingFeed(run([bash("grep alternate page.html", `href="${feed}"`)]), feed).passed).toBe(true);
    expect(noticedExistingFeed(run([bash(`curl -sL ${feed}`)]), feed).passed).toBe(true);
  });

  it("fails when the agent went straight to the JSON-LD", () => {
    expect(noticedExistingFeed(run([bash("ote-import-jsonld page.html")]), feed).passed).toBe(false);
  });
});

describe("maxFields", () => {
  it("is the blunt proxy for invention with no source to diff against", () => {
    expect(maxFields({ a: 1, b: 2 }, 8).passed).toBe(true);
    expect(maxFields(Object.fromEntries([...Array(12)].map((_, i) => [`f${i}`, i])), 8).passed).toBe(false);
  });
});

describe("wroteNoEventFile", () => {
  it("passes when the agent found the existing feed and wrote nothing", () => {
    const r = run([says("corunajug.org/feed.json already exists — nothing to create.")]);
    expect(wroteNoEventFile(r).passed).toBe(true);
  });

  it("fails when it derived a duplicate anyway", () => {
    const r = run([writes("events/2026-11-07-x.json")]);
    const c = wroteNoEventFile(r);
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("events/2026-11-07-x.json");
  });

  it("ignores writes that are not event documents", () => {
    expect(wroteNoEventFile(run([writes("src/layouts/Base.astro")])).passed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// The branch #120 was about: the feed exists, this event is not in it.
// `wroteNoEventFile` above is the other half, and the two must not both pass
// on the same run.
// ---------------------------------------------------------------------------

const feed = (events: Record<string, unknown>[]) => ({ specVersion: "0.6.0", events });
const entry = (id: string, name: string, startDate = "2026-11-19T19:15") => ({ id, name, startDate });

describe("appendedEvent", () => {
  const before = feed([entry("https://x.example/events/a-2026-01-10", "Talk A")]);

  it("passes when the feed gained exactly the event asked for", () => {
    const after = feed([...before.events, entry("https://x.example/events/b-2026-11-19", "AI-Assisted DDD")]);
    expect(appendedEvent(before, after, "AI-Assisted").passed).toBe(true);
  });

  it("fails when nothing was appended — the Step 6 dead-end this case exists for", () => {
    const c = appendedEvent(before, before, "AI-Assisted");
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("(none)");
  });

  it("fails when it appended more than the one event", () => {
    const after = feed([
      ...before.events,
      entry("https://x.example/events/b-2026-11-19", "AI-Assisted DDD"),
      entry("https://x.example/events/c-2026-12-01", "Something else"),
    ]);
    expect(appendedEvent(before, after, "AI-Assisted").passed).toBe(false);
  });

  it("fails when the appended event is not the one asked for", () => {
    const after = feed([...before.events, entry("https://x.example/events/b-2026-11-19", "Kotlin básico")]);
    expect(appendedEvent(before, after, "AI-Assisted").passed).toBe(false);
  });

  it("fails when adding one event dropped another — the count is +1 either way", () => {
    const start = feed([
      entry("https://x.example/events/a-2026-01-10", "Talk A"),
      entry("https://x.example/events/b-2026-02-10", "Talk B"),
    ]);
    const after = feed([start.events[0], entry("https://x.example/events/c-2026-11-19", "AI-Assisted DDD")]);
    const c = appendedEvent(start, after, "AI-Assisted");
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("dropped: Talk B");
  });

  it("fails when the append stripped the id off a published entry", () => {
    const start = feed([entry("https://x.example/events/a-2026-01-10", "Talk A")]);
    const idless = { ...start.events[0] } as Record<string, unknown>;
    delete idless.id;
    const after = feed([idless, entry("https://x.example/events/c-2026-11-19", "AI-Assisted DDD")]);
    const c = appendedEvent(start, after, "AI-Assisted");
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("dropped: Talk A");
  });

  it("fails when two published entries traded ids — nothing added, nothing dropped", () => {
    const start = feed([
      entry("https://x.example/events/a-2026-01-10", "Talk A", "2026-01-10T19:00"),
      entry("https://x.example/events/b-2026-02-10", "Talk B", "2026-02-10T19:00"),
    ]);
    const after = feed([
      { ...start.events[0], id: "https://x.example/events/b-2026-02-10" },
      { ...start.events[1], id: "https://x.example/events/a-2026-01-10" },
      entry("https://x.example/events/c-2026-11-19", "AI-Assisted DDD"),
    ]);
    const c = appendedEvent(start, after, "AI-Assisted");
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("re-identified");
  });

  it("matches on id, so re-serializing the existing entries is not an append", () => {
    const after = feed([{ ...before.events[0], name: "Talk A (recording up)" }]);
    expect(appendedEvent(before, after, "Talk A").passed).toBe(false);
  });
});

describe("idFollowsSiblings", () => {
  const siblings = feed([
    entry("https://www.corunajug.org/events/ddd-by-a-dummy-2026-01-29", "DDD by a Dummy"),
    entry("https://www.corunajug.org/events/novedades-en-java-26-2026-03-25", "Novedades en Java 26"),
  ]);
  const withMinted = (id: string) => feed([...siblings.events, entry(id, "AI-Assisted DDD")]);

  it("accepts an id spelled like the entries already there", () => {
    const c = idFollowsSiblings(
      siblings,
      withMinted("https://www.corunajug.org/events/ai-assisted-domain-driven-development-2026-11-19"),
    );
    expect(c.passed).toBe(true);
  });

  it("rejects a different host, www included", () => {
    const c = idFollowsSiblings(siblings, withMinted("https://corunajug.org/events/ai-assisted-ddd-2026-11-19"));
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("is not under");
  });

  it("rejects the kit's date-first default when every sibling trails its date", () => {
    const c = idFollowsSiblings(siblings, withMinted("https://www.corunajug.org/events/2026-11-19-ai-assisted-ddd"));
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("mid-id");
  });

  it("derives the pattern, so a feed with no dates in its ids is held to the prefix only", () => {
    const dateless = feed([
      entry("https://gdgmalaga.dev/events/biznagafest", "BiznagaFest"),
      entry("https://gdgmalaga.dev/events/devfest", "DevFest"),
    ]);
    const after = feed([...dateless.events, entry("https://gdgmalaga.dev/events/2026-11-19-charla", "Charla")]);
    expect(idFollowsSiblings(dateless, after).passed).toBe(true);
  });

  it("tolerates one undated sibling, which real feeds have", () => {
    const mixed = feed([...siblings.events, entry("https://www.corunajug.org/events/mesa-final-temporada", "Mesa")]);
    const after = feed([...mixed.events, entry("https://www.corunajug.org/events/charla-2026-12-10", "Charla")]);
    expect(idFollowsSiblings(mixed, after).passed).toBe(true);
  });

  it("rejects an id that is the prefix itself, or that nests a new path segment", () => {
    const bare = idFollowsSiblings(siblings, withMinted("https://www.corunajug.org/events/"));
    expect(bare.passed).toBe(false);
    expect(bare.detail).toContain("the prefix itself");

    const nested = idFollowsSiblings(siblings, withMinted("https://www.corunajug.org/events/2026/ai-2026-11-19"));
    expect(nested.passed).toBe(false);
    expect(nested.detail).toContain("nests a path");
  });

  it("fails rather than passes when the siblings themselves share no pattern", () => {
    const twoHosts = feed([
      entry("https://a.example/events/x-2026-01-01", "X"),
      entry("https://b.example/ev/y-2026-02-01", "Y"),
    ]);
    const elsewhere = feed([...twoHosts.events, entry("https://eventbrite.es/e/z-tickets-1", "Z")]);
    const c = idFollowsSiblings(twoHosts, elsewhere);
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("share no pattern");

    const urns = feed([entry("urn:ote:a:1", "A"), entry("urn:ote:b:2", "B")]);
    const afterUrns = feed([...urns.events, entry("https://eventbrite.es/e/z", "Z")]);
    expect(idFollowsSiblings(urns, afterUrns).passed).toBe(false);
  });

  it("says so rather than passing when there is nothing to derive from", () => {
    expect(idFollowsSiblings(feed([]), feed([entry("https://x.example/events/a", "A")])).passed).toBe(false);
    expect(idFollowsSiblings(siblings, siblings).passed).toBe(false);
  });

  /**
   * Calibrated against reality, not against the rule: the ids are the frozen
   * CoruñaJUG capture, and the minted id is the one that community's own feed
   * actually carries for the event the new eval case asks about. If this ever
   * disagrees, the derived rule is wrong, not the feed.
   */
  it("accepts what the real feed really minted, over the real fixture", () => {
    const fixture = JSON.parse(readFileSync(resolve(fixturesDir, "corunajug-feed.json"), "utf8"));
    const after = { ...fixture, events: [...fixture.events, entry(
      "https://www.corunajug.org/events/ai-assisted-domain-driven-development-2026-11-19",
      "AI-Assisted Domain-Driven Development",
    )] };
    expect(idFollowsSiblings(fixture, after).passed).toBe(true);
    expect(appendedEvent(fixture, after, "AI-Assisted Domain-Driven Development").passed).toBe(true);
  });
});

describe("wroteNoSecondFeed", () => {
  const dirWith = (files: Record<string, string>): string => {
    const dir = mkdtempSync(join(tmpdir(), "ote-assert-"));
    for (const [name, body] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, name)), { recursive: true });
      writeFileSync(join(dir, name), body);
    }
    return dir;
  };
  const runIn = (dir: string, turns: Turn[]): Run => ({ skillsLoaded: ["ote-event"], turns, dir });

  it("passes when the only feed touched is the one that already existed", () => {
    const dir = dirWith({ "feed.json": JSON.stringify(feed([entry("https://x.example/events/a", "A")])) });
    expect(wroteNoSecondFeed(runIn(dir, [writes("feed.json")]), ["feed.json"]).passed).toBe(true);
  });

  it("passes on a fixture repo that ships a feed and a run that added none", () => {
    const dir = dirWith({ "events.json": JSON.stringify(feed([])), "README.md": "# site" });
    expect(wroteNoSecondFeed(runIn(dir, []), ["events.json"]).passed).toBe(true);
  });

  it("catches a second feed written under a name the scan could have missed", () => {
    const dir = dirWith({
      "feed.json": JSON.stringify(feed([])),
      "events.jsonld": JSON.stringify(feed([entry("https://x.example/events/a", "A")])),
    });
    const c = wroteNoSecondFeed(runIn(dir, []), ["feed.json"]);
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("events.jsonld");
  });

  it("catches a second feed the transcript never recorded as a write", () => {
    const dir = dirWith({
      "feed.json": JSON.stringify(feed([])),
      "public/events.json": JSON.stringify(feed([entry("https://x.example/events/a", "A")])),
    });
    const c = wroteNoSecondFeed(runIn(dir, [bash("cat > public/events.json <<EOF")]), ["feed.json"]);
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("public/events.json");
  });

  it("does not count the harness's own scaffolding as the run's work", () => {
    const dir = dirWith({
      "feed.json": JSON.stringify(feed([])),
      ".eval-bin/https%3A%2F%2Fx.example%2Ffeed.json": JSON.stringify(feed([entry("https://x.example/events/a", "A")])),
      ".agents/skills/ote-event/example.json": JSON.stringify(feed([])),
    });
    expect(wroteNoSecondFeed(runIn(dir, []), ["feed.json"]).passed).toBe(true);
  });

  it("fails on a second feed under any name", () => {
    const dir = dirWith({
      "feed.json": JSON.stringify(feed([])),
      "events.json": JSON.stringify(feed([entry("https://x.example/events/a", "A")])),
    });
    const c = wroteNoSecondFeed(runIn(dir, [writes("events.json")]), ["feed.json"]);
    expect(c.passed).toBe(false);
    expect(c.detail).toContain("events.json");
  });

  it("does not count an event document as a feed", () => {
    const dir = dirWith({
      "feed.json": JSON.stringify(feed([])),
      "events/charla.json": JSON.stringify(entry("https://x.example/events/charla", "Charla")),
    });
    expect(wroteNoSecondFeed(runIn(dir, [writes("events/charla.json")]), ["feed.json"]).passed).toBe(true);
  });

  it("treats an unreadable write as not a feed rather than as a verdict", () => {
    const dir = dirWith({ "notes.json": "{ this is not json" });
    expect(wroteNoSecondFeed(runIn(dir, [writes("notes.json")]), ["feed.json"]).passed).toBe(true);
  });
});
