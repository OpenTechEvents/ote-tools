# build-feed fixtures

Two miniature organizer repos (the layout a fork of ote-template has):

- `valid/` — `ote.config.json` + three events. Events carry no `license` or
  `specVersion` (they inherit the feed's). `0-devfest.json` sorts first by
  filename but has the latest `startDate`, guarding the by-date feed order.
  The config carries an extra `profile` key the builder must ignore.
- `invalid/` — config missing `feed.license` with a malformed `licenseUrl`,
  one event with a UTC offset in `startDate`, one missing `name`. Every
  problem must be reported with its file and field.
