# OTE organizer skills

Agent Skills that let an organizer publish their events as OTE by asking for it in
plain language, from whatever agent they already use.

> **"Create the OTE spec for this conference — https://eventos.wiki/events/2026/biznagafest — and add it to our website."**

| Skill | What it does |
| --- | --- |
| [`ote-event`](ote-event/) | Turns an event page URL, a `.ics` export or a description into a valid OTE event document, and — if asked — adds the discovery tag, the badge, schema.org JSON-LD and the widgets to the community's site. |

More will follow (`ote-feed` for first-time setup, `ote-publish` over `apps/publish`);
`ote-event` is deliberately first because it is the request organizers actually make.

## Why a skill and not another web tool

The editor cannot `fetch` meetup.com — no CORS headers — so its import flow has to ask
the organizer to paste the page source. An agent has no such limit: it fetches the URL
itself. And it is already inside the website's repo, which is the only place the
`<link rel="alternate">` tag and the badge can actually be added.

The skill does not reimplement any of the mapping or validation. It drives this
repo's CLIs and relays their output:

```
agent          → fetches, asks, writes files, commits
ote-import-*   → decide the mapping (schema.org/iCalendar → OTE)
ote-validate   → decides validity. Nothing else does.
```

## Requirements

- **Node 20+** (for `npx`), and an agent that can run shell commands.
- Network access, for fetching the event page and the packages.

> ⚠️ The importer CLIs (`ote-import-jsonld`, `ote-import-ics`) ship from this branch
> and are **not published to npm yet**. Until the next patch release the skill's
> extraction step only works against a local checkout — see
> [Running against a checkout](#running-against-a-checkout).

## Install

A skill is a folder with a `SKILL.md` in it. The open format puts them in
`.agents/skills/` at the root of the repo you are working in, and that is the path
most agents read.

```sh
# in the repo you want to work in — the organizer's events repo, or their website
mkdir -p .agents/skills
git clone --depth 1 https://github.com/OpenTechEvents/ote-tools.git /tmp/ote-tools
cp -R /tmp/ote-tools/skills/ote-event .agents/skills/
```

To have it available in **every** project instead of one, put it in your agent's
personal skills directory:

| Agent | Project-wide | Personal (all projects) |
| --- | --- | --- |
| VS Code + GitHub Copilot | `.agents/skills/` | VS Code user profile |
| Claude Code (CLI, VS Code, JetBrains) | `.agents/skills/` or `.claude/skills/` | `~/.claude/skills/` |
| OpenAI Codex | `.agents/skills/` | — |
| Others | `.agents/skills/` | check its docs |

Paths move as these tools evolve. If the skill does not show up, the agent's own docs
for "skills" are the authority — the folder contents are identical either way, so a
`cp -R` to the right place is the whole fix.

### Check it loaded

Ask the agent to list its skills (in VS Code Copilot and Claude Code: type `/skills`).
`ote-event` should appear. If it does not, the folder is in the wrong place.

## Using it: pick an agent with a terminal

The skill's whole guarantee is that **a program, not a language model, decides whether
your file is valid**. That program runs in a shell. So:

**✅ Works fully** — VS Code with Copilot (Agent mode), Claude Code, Codex, or any
agent that can run commands in your project:

```
You: create the OTE spec for https://eventos.wiki/events/2026/biznagafest
     and add it to our website
```

What should happen, in order: it checks whether the page already publishes an OTE
feed; extracts the event; shows you a short summary in prose and asks **one** grouped
question about what the page could not say (timezone, data license); writes the file;
runs the validator and shows you its output; asks before committing; then offers the
website pieces one by one.

**⚠️ Chat-only desktop clients** (a desktop assistant with no code execution) can
load the skill and will help you draft the document, but **cannot run the validator**.
The skill tells the agent to say so rather than guess. Finish those cases by hand at
<https://validator.opentechevents.org/> — paste or upload the file and it gives the
same verdict. Use this path only if you have no agent with a terminal.

**Seeing it as a form instead of JSON**: <https://tools.opentechevents.org/editor/?repo=owner/name>
reads what is already committed in an organizer-kit fork. A local round-trip
(`npx` opens the editor on the working-tree file and writes your edits back) is the
planned next step and is not built yet.

## What it will not do

By design, and these are the ones worth knowing before you trust it with your feed:

- It will not tell you a document is valid without showing the validator's output.
- It will not invent a field your source did not carry. Absent is a valid state in
  OTE, and a warning from the importer becomes a question to you, not a default value.
- It will not change an `id` you have already published, or rename an event file
  because the date moved — both silently create duplicates in every calendar and
  directory that subscribed to you.
- It will not edit your website's templates, README or `<head>` without asking first.

## Running against a checkout

While the importer CLIs are unpublished, point the skill at a local build:

```sh
git clone https://github.com/OpenTechEvents/ote-tools.git
cd ote-tools && pnpm install && pnpm build
```

Then the two extraction commands become, from your project:

```sh
curl -sL "<event url>" | node /path/to/ote-tools/packages/import-jsonld/dist/bin.js -
node /path/to/ote-tools/packages/import-ics/dist/bin.js --tz Europe/Madrid calendar.ics
```

`ote-validate` and the exporters are published, so their `npx` forms in the skill work
as written today.

## Developing the skills

- English is canonical in this repo, including skill bodies. The skill instructs the
  agent to *talk* to the organizer in the organizer's language.
- Keep `SKILL.md` short: it is loaded in full whenever the skill activates. Anything
  long, conditional or rarely needed goes in `references/`, which the agent reads only
  when it gets there.
- Changing a `description` changes **when** the skill fires — run the activation evals
  (`evals/`) before and after, or you are guessing.
