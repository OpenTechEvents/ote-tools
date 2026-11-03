import { describe, expect, it } from "vitest";

import {
  absentField,
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
      bash('curl -sL "https://x.example" | npx -y -p @opentechevents/import-jsonld@0.4 ote-import-jsonld -'),
      bash("npx -y -p @opentechevents/validate@0.4 ote-validate events/x.json"),
    ]);
    expect(ranValidator(r).passed).toBe(true);
    expect(ranImporter(r).passed).toBe(true);
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
