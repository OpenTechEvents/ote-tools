import { sortedEvents } from "@opentechevents/preview-feed";
import type { PreviewEvent } from "@opentechevents/preview-feed";

import type { GroupKey } from "./attrs.js";

export interface EventGroupInfo {
  key: string;
  type: GroupKey;
  index: number;
  total: number;
  members: PreviewEvent[];
}

export interface EventGroups {
  headerOf: Map<PreviewEvent, PreviewEvent>;
  infoOf: Map<PreviewEvent, EventGroupInfo>;
}

const EMPTY_GROUPS: EventGroups = { headerOf: new Map(), infoOf: new Map() };

/**
 * Buckets `events` by `partOf.id`, keeping only buckets with 2+ members (a
 * lone event with `partOf` but no visible sibling renders normally). Each
 * bucket is ordered via `sortedEvents` — soonest-future first, else
 * most-recent-past first — so `members[0]` is always the header: the next
 * upcoming occurrence, or the latest past one if none are upcoming. The
 * bucket's `type` is taken from that header member specifically, so a feed
 * with inconsistent per-occurrence `partOf.type` values can't silently
 * fragment one series into two, and the `enabled` gate and the visible badge
 * label always agree.
 */
export function computeEventGroups(events: PreviewEvent[], enabled: ReadonlySet<GroupKey>): EventGroups {
  if (enabled.size === 0) return EMPTY_GROUPS;

  const buckets = new Map<string, PreviewEvent[]>();
  for (const event of events) {
    const id = event.partOf?.id;
    if (!id) continue;
    const bucket = buckets.get(id);
    if (bucket) bucket.push(event);
    else buckets.set(id, [event]);
  }

  const headerOf = new Map<PreviewEvent, PreviewEvent>();
  const infoOf = new Map<PreviewEvent, EventGroupInfo>();
  for (const [key, rawMembers] of buckets) {
    if (rawMembers.length < 2) continue;
    const members = sortedEvents(rawMembers);
    const header = members[0]!;
    const type = header.partOf!.type;
    if (!enabled.has(type)) continue;
    const total = members.length;
    members.forEach((member, i) => {
      headerOf.set(member, header);
      infoOf.set(member, { key, type, index: i + 1, total, members });
    });
  }

  return { headerOf, infoOf };
}
