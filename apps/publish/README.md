# Broadcast

The publishing console for an OTE feed. Pick the event you are publishing, then
work down a dashboard of the places it can go — event platforms, directories,
social networks, chat groups, and your own site.

Nothing is posted on your behalf. Every destination either generates something
you paste, or lays your event's own answers out field by field next to the form
that wants them. The tool holds no accounts and no credentials.

## Using it

Open it with a feed:

```
https://tools.opentechevents.org/publish/?repo=owner/name
https://tools.opentechevents.org/publish/?feed=https://example.org/feed.json
```

`?repo=` is the convention the rest of the kit uses — it tries the fork's
GitHub Pages URL first, then `raw.githubusercontent.com` on the default branch.
`?feed=` covers a feed published anywhere else.

The event you pick is remembered per feed, along with your starred
destinations and your theme.

## Developing

```sh
pnpm build            # from the repository root, first, in a fresh clone
pnpm --filter @opentechevents/publish dev
```

`index.html` and `styles.css` are copied into `dist/` **once** at startup, so
re-run the copy (or restart) after editing either.

| Script         | What it does                                              |
| -------------- | --------------------------------------------------------- |
| `dev`          | esbuild watch plus a local server (`PORT` to choose one)   |
| `build`        | one-shot bundle into `dist/`                               |
| `test`         | vitest over `src/lib/`                                     |
| `typecheck`    | `tsc --noEmit`                                             |
| `gen:icons`    | regenerates `src/lib/icons.generated.ts`                   |
| `check:links`  | checks every catalogue URL still answers (not part of CI)  |

Read `CLAUDE.md` in this directory before changing anything — it records why
the tool is shaped the way it is.
