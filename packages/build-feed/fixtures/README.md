# build-feed fixtures

Two miniature organizer repos (the layout a fork of ote-template has):

- `valid/` — `ote.config.json` + three events. Events carry no `license` or
  `specVersion` (they inherit the feed's). `0-devfest.json` sorts first by
  filename but has the latest `startDate`, guarding the by-date feed order.
  The config carries an extra `profile` key the builder must ignore.
- `invalid/` — config with a malformed `licenseUrl` and no `feed.license`;
  neither event declares its own license either, so D029 fails both (a feed
  may omit `license` only when every event declares its own instead). One
  event also has a UTC offset in `startDate`, the other is missing `name`.
  Every problem must be reported with its file and field.
