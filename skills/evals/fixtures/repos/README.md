# Fixture repos

Each one is the starting state of a run directory, copied in by `src/setup.ts`
(`repo: "<name>"` in a case).

| Repo | What it is | Which case needs it |
| --- | --- | --- |
| `kit-fork-with-one-event` | An organizer-kit fork: `ote.config.json` plus one already-published event. The event carries no `specVersion` and no `license` **on purpose** — both are inherited from the config when `ote-build-feed` assembles the feed, and `ote-build-feed . --check` passes on it as it stands. | `id-is-permanent`, `no-shell-no-verdict` |
| `site` | A community website (Astro) with a real layout, a page, and an `alternate` link that points at a **blog's RSS** — so "a tag already exists" is not the same as "the feed is declared". No OTE feed published yet. | `website-asks-first` |
| `site-with-feed` | The same site, with `events.json` already published at its root. | `badge-points-at-the-feed` |

`site` and `site-with-feed` differ by exactly one file. That is the point: the
first is "the feed does not exist yet", the second is "it does, so the badge has
something true to point at".
