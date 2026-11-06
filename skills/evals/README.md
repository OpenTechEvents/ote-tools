# Evals for the organizer skills

An eval is a test whose subject is an agent instead of a function. Same idea as
any other test — fixed input, assert on the output — with two differences that
decide how everything here is built:

1. **It is stochastic.** The same prompt does not produce the same run twice. A
   single green run proves nothing, so every case runs **three times** and what
   is reported is a pass rate.
2. **The interesting output is the trajectory, not the answer.** "Did it write a
   valid file" matters less than "did it check, or did it guess".

## The two things measured, and why they are separate

| | Question | Cost | When to run |
| --- | --- | --- | --- |
| **Activation** (`cases/activation.json`) | Does the skill fire on what organizers type, and stay quiet otherwise? | Cheap — the run stops as soon as the agent says which skills it loaded | Every PR that touches a `description` |
| **Behavior** (`cases/behavior.json`) | Once it fired, did the agent hold the invariants? | Expensive — full conversations | Every PR that touches a `SKILL.md` or a `references/` file |

A third thing lives here and is not an eval: `test/version-pins.test.ts`, a plain
unit test over the skills' **version literals** — the `npx` pins, the embed URL,
the `specVersion` in examples, and the spec version each fixture is stamped at.
No agent, no API key, runs in CI with everything else. It is here rather than in
`packages/` because what it guards is prose, and because the fixtures it checks
are these fixtures. See the root `CLAUDE.md` for what it holds and why each rule
is there.

Keeping the two evals apart is the point. Activation is a **recall problem** solved by
rewriting one sentence of frontmatter; behavior is a **prompt problem** solved by
rewriting the body. A single blended score tells you neither.

### Activation: the negatives are the dataset

20 positive prompts, 10 negative. The negatives are what people leave out, and
they are where the value is: a skill that fires on *"create an .ics to email the
attendees"* has learned to fire on the word "event", and it will fire on
everything.

Metrics: recall on the positives, false-activation rate on the negatives. Once
`ote-feed` and `ote-web` exist, this grows a confusion matrix between them — *"add
the badge"* must reach the website skill, not this one.

### Behavior: assertions, not opinions

Almost every check in `cases/behavior.json` is a **mechanical assertion** over the
transcript and the files the run left behind — see `src/assertions.ts`:

| Check | What it catches |
| --- | --- |
| `ranValidator` / `ranImporter` | the agent deciding validity or mapping on its own |
| `fileIsValid` | ground truth: the validator run by the harness, over what is on disk |
| `claimedValidityWithoutProof` | "this looks valid" arriving before the evidence |
| `noInventedFields` | every field must trace to the source or to something the organizer said |
| `idPreserved`, `slugUnchanged` | the two invariants that silently duplicate an event in every subscriber |
| `absentField`, `commandLacks` | an email lifted out of a calendar nobody published |
| `groupedQuestions` | the UX goal as a number: asked once, not interrogated |
| `askedBeforeTouching` | nothing in a public website edited before a yes |
| `noticedExistingFeed` | re-deriving a document that already exists upstream |

An LLM judge is used for **one** thing, deliberately: *"is this `id` minted under
a domain the organizer controls?"* (`mintsIdUnder`), which no assertion can decide.
When you add a judge, make it answer **binary** questions. A 1–5 score from a judge
is not comparable between runs and will quietly drift your pass bar.

### The simulated organizer

The flow has three gates that wait for a human, so a case needs a stand-in: a
cheap model with a persona card (`src/persona.ts`). The rule that does the work is
the last one:

> NEVER volunteer a fact you were not explicitly asked for.

Without it, the fake organizer dumps everything up front, the agent never has to
ask well, and `groupedQuestions` measures nothing.

## Running them

```sh
pnpm --filter @opentechevents/skill-evals test   # unit tests of the assertions — no agent, no API key
```

Run that first and keep it green in CI. The assertions are the measuring
instrument; an uncalibrated instrument turns a real regression into a green run.

Driving a real agent needs its CLI on your PATH and the suite runner, which is
not written yet — see [What is not built](#what-is-not-built). The pieces that are
here (`src/adapters.ts`, `src/setup.ts`, `src/assertions.ts`, the cases) are what
that runner composes, and each is usable on its own today.

Each case will run in a throwaway directory built by `src/setup.ts`: the fixture repo,
the loose files, the skill installed at `.agents/skills/ote-event` exactly as an
organizer would install it, and a `curl` shim that serves **only** this case's
fixtures and exits 6 on anything else.

**Fixtures are frozen files, never live URLs.** `fixtures/biznagafest.html` is a
real capture of a real page, and that is the only way it stays useful: pointed at
the live URL, the case would start failing the day the page changes, for a reason
with nothing to do with the skill — and whoever hits it spends an afternoon looking
in the wrong place.

## Reading a result

Set the pass bar **before** looking at the numbers, or you will fit it to whatever
came out. The bar for `ote-event`:

| Check | Bar |
| --- | --- |
| `ranValidator`, `noInventedFields`, `idPreserved`, `slugUnchanged`, `absentField` (the email) | **3/3.** These are correctness, not style. |
| `fileIsValid`, `claimedValidityWithoutProof`, `askedBeforeTouching` | 3/3 |
| `groupedQuestions`, `noticedExistingFeed` | 2/3 |

A check that fails 1/3 is not noise — it is a real behavior that appears a third of
the time. Fix the skill text, do not re-roll.

## Adding a case

1. Freeze the input as a file in `fixtures/` (a real page, a real `.ics` — not
   something you wrote by hand to pass).
2. Add the case to `cases/behavior.json`: `prompt`, the `fixtures`/`files`/`repo`
   it needs, the `persona`, the `checks`, and a `watch_for` line naming the failure
   you expect to see. That line is what makes a failed run legible to the next
   person.
3. If the check you need does not exist, add it to `src/assertions.ts` **with a unit
   test**. No exceptions: an assertion nobody tested is a lie waiting to be believed.

## What is not built

Honest inventory, so nobody assumes more than exists:

- **The runner that drives the whole suite.** `src/adapters.ts` normalizes one
  agent's transcript and `src/setup.ts` builds the run directory; what is missing is
  the loop that walks the cases, resumes the session with the simulated organizer's
  replies, applies the checks by name, and repeats each case three times.
  Multi-turn resumption is the part that differs most between agents, which is why
  it is not sketched in here.
- **Adapters other than `claude-code`.** Adding one means normalizing that agent's
  transcript into `src/transcript.ts`'s shape. Nothing else in the evals is
  agent-specific — not the cases, not the assertions.
- **The `mintsIdUnder` judge.**
