---
name: ote-event
description: Publish a tech community event as an OTE (Open Tech Events) document and expose it on the community's website. Use when given an event page URL (Meetup, Eventbrite, Luma, eventos.wiki, a conference site), a Google Calendar or .ics export, or a plain description of an event, and the user wants an OTE event file, an events.json feed, a feed `<link rel="alternate">` tag, an OTE badge, or schema.org JSON-LD for their events. Triggers include "create the OTE spec for this conference", "add my events to my website", "make my events discoverable", "publicar mis eventos", "añade este meetup".
---

# Publishing an event as OTE

You are helping an event organizer, not a developer. They may never see the JSON.
Your job is to get a **valid** OTE document written, confirmed by them, and — if they
asked — linked from their website.

## The one rule

**Never state that a document is valid.** Validity is decided by one program:

```sh
npx -y -p @opentechevents/validate@0.6 ote-validate <file|dir>
```

Exit `0` = valid · `1` = invalid · `2` = usage or I/O problem · `3` = **this release
cannot judge that `specVersion`** — not a defect in the document. Show its output as it
came. If you cannot run it, say so and stop at that step — do not substitute your own
reading of the schema. The same holds for extraction: the importers below own the
mapping, you do not re-derive it.

**Ask the tool what it supports rather than assuming.** It answers:

```sh
npx -y -p @opentechevents/validate@0.6 ote-validate --versions
```

### When the CLI is behind the spec

This happens: a spec version is published before the tools that implement it ship. The
rule is the same as everywhere else in this skill — **do not improvise a verdict.**

- Exit `3` means exactly "I have no rules for that version", and it is deliberately
  distinct from `1`. Read it as *not judged*, never as *invalid*, and never tell an
  organizer their document is broken on the strength of it.
- Write the version the installed CLI supports (`--versions` names it), get a real
  `0`, and say plainly that a newer spec release exists. A document on a supported
  older release is valid — that is what the support window is for.
- Do not hand-assemble a validator to fill the gap. That is how a run reports
  everything green while silently skipping the rules that would have failed it.

## Step 0 — Find the source of truth, and separate it from the copies

Do this before extracting anything. The same event is usually described in several
places, and **they do not agree**. Getting this wrong is the one mistake that
publishes bad data confidently.

**The source of truth is the event's own site, on a domain the organizer controls** —
`biznagafest.com`, the community's own domain. A directory that lists the event
(eventos.wiki, dev.events, a community aggregator) is a **starting point for data,
never the identity and never the authority.**

1. **Identify the official site.** Ask if it is not obvious, or take the `url` field
   of any copy you find — it points at the event's real page.
2. **Check whether the organizer already publishes OTE**, by looking in the `<head>`
   of *their own* site:

   ```html
   <link rel="alternate" type="application/ote+json" href="https://.../events.json">
   ```

   Accept `application/ote+json`, `application/feed+json`, and a plain `.json` href —
   the media type is still open in the spec, so do not require one spelling.

   **A `rel="alternate"` tag is not a feed declaration until you check it.** Sites
   emit bare `<link rel="alternate">` with no `href` and no `type` as framework
   noise (biznagafest.com does), and plenty of real ones point at an RSS feed for a
   blog. Require an `href`, and fetch it before believing it.

   - Found, on the organizer's own domain → the authoritative document already
     exists. Do not create a second one. Go to Step 6 and stop.
   - Not found → the organizer does not publish OTE yet. Continue.

3. **Then, and only then, look at the directories** — they can save the organizer
   retyping. `https://opentechevents.org/data/adopters.json` lists who has declared
   they publish OTE (name, url, feed; a `directory` id when the feed is a directory
   rather than one community). Being listed there means *"this feed is real OTE"*. It
   does **not** mean *"this feed is right about somebody else's event"*.

4. **Reconcile, never merge silently.** If a directory's copy and the official site
   disagree, **the organizer's own site wins**, and you show the disagreement rather
   than picking:

   ```
   eventos.wiki lists this event, and it differs from biznagafest.com:
     · ends 18:00 there, 21:00 on your site
     · no ticket price there; your site says 16 EUR
   I'm using your site. Correct?
   ```

   This is real: that is exactly how those two sources differed when this skill was
   written. A directory's copy goes stale and nobody tells it.

5. **If you took data from a directory, `source` is required** (`{ name, url,
   retrievedAt }`) and the `id` you mint goes under the **organizer's** domain, never
   the directory's. An `id` under someone else's domain is an identity the organizer
   can lose. `organizers` is not `source`: the event is run by GDG Málaga *and*
   sourced from eventos.wiki, and both appear.

## Step 1 — Extract

Pick by what the organizer gave you. Never hand-map fields yourself.

> **About the version pins below.** Every package is on `@0.6`, which implements OTE
> Spec 0.6.0. The pins are not decoration: they say which release was actually tested
> with these instructions. Move one when that package ships a newer line, in the same
> change, and never raise one past what npm has — `skills/evals/test/version-pins.test.ts`
> fails the build if a pin here names a line this repo no longer ships, including the
> ones in `references/`. If the installed CLI disagrees with a pin, the CLI is right
> and this file is stale: `--versions` is the authority, not the prose.

**An event page URL** — fetch it, pipe the HTML in:

```sh
curl -sL "<event url>" | npx -y -p @opentechevents/import-jsonld@0.6 ote-import-jsonld -
```

If your environment cannot fetch (or the site blocks you), ask the organizer to paste
the page source and pass it the same way via a file. Exit `1` means the page carries no
schema.org Event — fall back to asking them directly, do not invent fields from prose
in the page.

**An agenda that exists only as prose is out of scope for extraction.** A conference
page often publishes one `Event` block for the conference and writes its seventeen
talks as HTML — headings, a table, a grid of cards. Reading those into events is
exactly the hand-mapping this skill forbids, and the reason is not pedantry: prose
drops a track, a timezone or a co-speaker without ever signalling it, and the result
looks as confident as data that came from the source.

The route when the organizer wants those talks published:

1. Say plainly that the page carries no structured agenda, so the talks cannot be
   extracted — and that this is a limit of the source, not of their event.
2. Offer the two real options: they supply the agenda in a form that *is* data (a
   `.ics` export, a CSV, a list they confirm field by field), or they publish the
   conference as one event now and add the parts later.
3. If they dictate the talks to you, that is **them describing their own event** —
   the "only a description in chat" path. Write only the fields they gave, confirm
   each one, and set `source` to the conference page only if they tell you that is
   where it came from.

What you must not do is read the agenda off the page and present it as imported.

**A `.ics` / Google Calendar export:**

```sh
npx -y -p @opentechevents/import-ics@0.6 ote-import-ics --tz <IANA zone> \
  --source-url <where the .ics came from> calendar.ics
```

Pass `--public` **only** if the calendar is itself publicly published — it is what
allows the organizer's email through, and a calendar shared by link is not publication.

`--source-url` is where the `.ics` was fetched from. Give it: without it the importer
has no way to mint an `id`, and it is also what lets a link be rescued from an HTML
description. If the community has its own domain, pass `--id-base <url>` instead and
the `id` is minted there — **the better option, and permanent either way.** An `id`
is minted once and never changes: re-importing later under a different base hands
every consumer that stored the old one a duplicate, with no way to relate the two.

**Only a description in chat** — write the fields they gave you and nothing else.

Both importers print `{ events, warnings }`. The events are **partial on purpose**.

## Step 2 — Gate 1: confirm what the source could not say

**Your question list is exactly two things**, and nothing beyond them:

1. **The importer's `warnings`.** Each one names an OTE field the source could not
   carry (`timezone` when the page gave only a UTC offset, and so on). Anything *not*
   warned about came from the source and does not need confirming.
2. **The required fields no source can supply**: `id` (you propose it — see Step 3)
   and `license`, the terms for reusing the event *data*. A standalone event is
   invalid without `license` and the importers do not warn about it, because it is
   not a mapping loss — it is the organizer's decision. Inside a kit fork it is
   usually already in `ote.config.json`: read it before asking.

Show what you got as **prose, not JSON**, and group every open question into **one**
message:

```
From that page:
  BiznagaFest · 7 Nov 2026, 09:00–18:00 · FYCMA, Málaga
  Organized by GDG Málaga · in person · tags: devops, backend, frontend, ia

Two things the page could not tell me:
  · timezone — Europe/Madrid, from the offset it gave? ← confirm
  · data license — which one for your feed? CC-BY-4.0 is the common choice
```

Do not interrogate field by field across turns. If an `ote.config.json` exists, read
its `profile` first (`meetup` / `conference` / `all`): it tells you which fields are
even relevant to this organizer, so you do not ask a meetup organizer about a CFP.

Mark every inference as an inference. A field nobody asserted stays absent — absent is
a valid state in OTE and inventing a value is the one thing the format exists to
prevent.

## Step 3 — Write the file

In an organizer repo that follows the kit, events live at `events/<slug>.json`;
otherwise ask where. See `references/writing.md` for the `id`, slug and `source` rules —
**read it before writing**, those three are the ones that silently break consumers.

The short form, which you must never violate:

- An `id` already published **never changes**, for any reason.
- A slug is minted once, from date + name, and **is never regenerated** — not even when
  the event's date later changes.
- `source` is required when the event was imported, omitted when the organizer is
  describing their own event.

## Step 4 — Gate 2: validate

Run the validator on what you wrote and paste its output. If the repo is a kit fork,
also check the feed assembles:

```sh
npx -y -p @opentechevents/build-feed@0.6 ote-build-feed . --check
```

Mention failures of the **recommended** profile once, as warnings, and move on: a valid
event with a missing `image` publishes fine. Do not negotiate warnings into blockers.

ℹ️ **The CLI judges a document by the version it declares** (since
`@opentechevents/validate@0.6.0`). A healthy feed on an older-but-supported release
comes back valid with a note saying a newer release exists — it is not an error, and it
does not change the verdict. This used to be the opposite, and the old behaviour is
what made tools report healthy feeds as broken; if you are running an older CLI, treat
a lone `specVersion` complaint as the pin talking, not as a defect in their data.

Outside the support window (the last three spec minors) migration *is* asked for, and
that is a real finding: the document is still measured against its own rules, so every
other finding in that report is real too.

Then offer a visual check, their choice, never forced:

> Want to see it in a form instead of JSON? <https://tools.opentechevents.org/editor/?repo=owner/name>
> (reads what is committed), or paste the file into <https://validator.opentechevents.org/>.

## Step 5 — Gate 3: publish

Ask before writing to a branch, committing, or opening anything. If the organizer owns
the repo, commit on a branch and offer the PR. If they do not have push rights, the
kit's path is a prefilled issue that a workflow turns into a PR — their maintainer
reviews it.

## Step 6 — The website

Only if they asked for it ("…and add it to the site", "make it discoverable", "add the
badge"). Read `references/website.md` and follow it. It covers the
`<link rel="alternate">` tag, the badge, schema.org JSON-LD for SEO, and the embeddable
listing — each one offered separately, each one confirmed before you edit a file.

A request like *"create the OTE spec for this conference and add it to the site"* is
Steps 0–5 **and** Step 6. Do not stop after the JSON.

## Never

- Claim validity without the validator's output.
- Fill a field the source did not carry and the organizer did not confirm.
- Change a published `id`, or rename an event file because its date moved.
- Import an organizer email from a calendar that is not publicly published.
- Edit a website's templates, README or `<head>` before asking.
- Hardcode `application/ote+json` as the only acceptable feed media type when reading.
- Treat a directory's listing as the authority on an event it did not organize, or
  mint an `id` under a directory's domain.
- Merge two sources that disagree without showing the organizer the disagreement.

## Language

Talk to the organizer in whatever language they wrote to you in. Field names, file
contents and commit messages stay in English.
