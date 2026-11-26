// A template string, not a stylesheet file: it's injected into the custom
// element's shadow root via a <style> element (see element.ts), so it never
// leaks onto the host page and the host page's CSS never leaks into it.
// The --ote-* custom properties are the one deliberate exception — CSS
// custom properties inherit through the shadow boundary, so a host page can
// override any of them (e.g. `ote-events { --ote-accent: #e91e63; }`)
// without piercing the rest of the encapsulation.
//
// :host deliberately has no `background` of its own — the widget is meant
// to blend into whatever page it's embedded in, not paint an opaque box
// behind itself. Only individual pieces (.event, .message, badges/tags)
// get a --ote-surface/--ote-accent-soft background, for contrast against
// the host page's own background, whatever that is.
export const WIDGET_CSS = `
:host {
  display: block;
  --ote-surface: #f6f7f9;
  --ote-border: #e3e6ea;
  --ote-text: #1c2128;
  --ote-muted: #626c77;
  --ote-accent: #3556c8;
  --ote-accent-hover: #2a46a8;
  --ote-accent-soft: #eef1fb;
  --ote-error: #c4302f;
  --ote-error-bg: #fcf1f1;
  --ote-radius: 8px;
  font-family: var(--ote-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-size: var(--ote-font-size, 1rem);
  color: var(--ote-text);
}

/* theme="auto" (the default: also matches when the attribute is absent)
   follows the host OS/browser preference. theme="dark" below applies the
   same overrides unconditionally, regardless of that preference. */
@media (prefers-color-scheme: dark) {
  :host([theme="auto"]),
  :host(:not([theme])) {
    --ote-surface: #1f2228;
    --ote-border: #33373f;
    --ote-text: #e6e8eb;
    --ote-muted: #9aa2ad;
    --ote-accent: #7d93e8;
    --ote-accent-hover: #97a8ee;
    --ote-accent-soft: #262c42;
    --ote-error: #f28b82;
    --ote-error-bg: #3a2323;
  }
}

:host([theme="dark"]) {
  --ote-surface: #1f2228;
  --ote-border: #33373f;
  --ote-text: #e6e8eb;
  --ote-muted: #9aa2ad;
  --ote-accent: #7d93e8;
  --ote-accent-hover: #97a8ee;
  --ote-accent-soft: #262c42;
  --ote-error: #f28b82;
  --ote-error-bg: #3a2323;
}

* {
  box-sizing: border-box;
}

/*
 * height: 100% is what lets a host size the widget with plain CSS -
 * ote-events { height: 400px }, or a flex/grid parent handing it a track -
 * and not just with the max-height attribute. Before it, the element obeyed
 * while its contents did not: the box took the height and the content kept
 * its own, so it either left dead space inside or spilled out of the
 * element (measured: a 400px element with 529px of calendar overflowing).
 *
 * It is safe precisely because it is a percentage. Against an auto-height
 * host - every embed that sets no height, which is most of them - it
 * resolves to auto and the widget lays out exactly as it did before. Only
 * a host that gives a definite height sees any change, which is the host
 * that asked for one.
 */
.ote-events {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.message {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  color: var(--ote-muted);
}

.message.error {
  background: var(--ote-error-bg);
  color: var(--ote-error);
}

ul.events {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.events.layout-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  overflow: hidden;
}

ul.events.layout-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--ote-card-min-width, 220px), 1fr));
  gap: 1rem;
}

/*
 * The max-height height budget (#168). Everything here is gated on
 * [data-bounded], set by element.ts only when the attribute parses, so an
 * embed without it lays out exactly as it did before.
 *
 * The widget becomes a flex column that is at most --ote-max-height tall,
 * and the *event area* is what scrolls - not the whole component. That
 * distinction is the whole point: the host-side workaround this replaces
 * wrapped <ote-events> in its own overflow container, which scrolled the
 * widget from the outside and so carried the calendar's own sticky weekday
 * header away with the content. Scrolling an inner element leaves the
 * headers a scrollport to pin against.
 *
 * No overflow on .ote-events itself except for cards, deliberately: the
 * detail modal is appended here as a sibling of the event area (render.ts),
 * and while a position: fixed backdrop is out of flow and survives either
 * way (verified in Chrome: backdrop height equals viewport height, top 0),
 * there is no reason to clip a box whose children handle their own overflow.
 */
/* The attribute is only the budget itself now; the fitting is unconditional. */
.ote-events[data-bounded] {
  max-height: var(--ote-max-height);
}

/* min-height: 0 is what lets a flex item shrink below its content and scroll. */
.ote-events[data-layout="list"] ul.events,
.ote-events[data-layout="calendar"] ul.events {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/*
 * layout="cards" scrolls the container instead of the event area, which is
 * the one place this breaks symmetry with the other two layouts.
 *
 * The reason is that a grid given a definite height sizes its implicit auto
 * rows against that height rather than against their content. Making the
 * grid the flex item that absorbs the budget squashed every card to ~85px -
 * verified in Chrome against an unbounded control rendering the same feed at
 * 297px, with .event's own overflow: hidden hiding everything below the
 * placeholder image, so the cards looked merely empty rather than clipped.
 * align-content: start does not prevent it. Keeping the grid at flex: none
 * leaves its rows content-sized, and the overflow becomes the container's to
 * scroll. Cards have no sticky header, so nothing is lost by scrolling the
 * outer element here - which is exactly why list and calendar must not.
 *
 * The padding is room for .event-stacked's box-shadow (group-events), which
 * reaches about 10px: the 1rem grid gap absorbs it between cards, but the
 * rightmost column and the last row sit flush against the scrollport's
 * edge, which clips. Nothing needed it before because an unbounded grid
 * never clipped anything. It is symmetric left/right so the grid does not
 * sit visibly off-centre against the scrollbar.
 */
.ote-events[data-layout="cards"] {
  overflow-y: auto;
}

.ote-events[data-layout="cards"] ul.events {
  flex: none;
  padding: 0 0.75rem 0.75rem;
}

/*
 * The event area as its own scrollport, mounted only when there is a
 * footer (#68) — render.ts explains why its presence is conditional.
 *
 * It exists for layout="cards" and for nothing else: cards scroll
 * .ote-events itself (see above), so a footer appended inside it would
 * scroll away with the grid, and in a bounded widget the subscribe badges
 * would sit below the fold of a box the host deliberately shortened. With
 * the wrapper absorbing the budget, .ote-events has nothing left to
 * scroll and the footer stays put.
 *
 * list and calendar need nothing new: the rules above reach ul.events
 * and .calendar-host as descendants, so the row list and the month grid
 * still absorb the budget themselves, one level deeper. The footer is the
 * flex sibling that the budget is spent on before they see it, which is
 * what "subtracted from the budget, not drawn over the last row" means.
 */
.events-scroll {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.ote-events[data-layout="cards"] > .events-scroll {
  overflow-y: auto;
}

/*
 * layout="list" sets overflow: hidden to clip its own border radius. The
 * longhand above wins on overflow-y only, which is what we want: the rows
 * scroll vertically and the rounded corners still clip horizontally.
 *
 * The column header is already opaque (--ote-accent-soft), so pinning it
 * needs no extra background - and it earns its place on the 460-event feed
 * this attribute exists for, where "When" scrolling out of sight leaves
 * three unlabelled columns.
 */
.ote-events[data-layout="list"] ul.events.layout-list .event-list-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}

/*
 * layout="calendar". The library's root (.ec) takes an inline height: 100%
 * from the height option (calendar-layout.ts#bounded), so .calendar-host
 * has to hand it a definite height to resolve against.
 */
.ote-events[data-layout="calendar"] .calendar-host {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.ote-events[data-layout="calendar"] .calendar-host .ec {
  flex: 1;
  min-height: 0;
}

/*
 * .ec-main is the library's scroll container and holds its sticky .ec-header,
 * but dayMaxEvents:true adds .ec-uniform, which sets overflow: hidden.
 *
 * A bounded calendar normally has nothing to scroll: calendar-layout.ts
 * drops the row pin so the weeks share the budget and the month fits. This
 * is the safety valve for the budgets where that is not enough - small
 * enough that even the day headers do not fit their share - where the
 * library would otherwise clip them silently with no way to reach them.
 *
 * One class more specific than the library's rule, same technique (and same
 * reason) as the row-height pin below - never !important.
 */
.ote-events[data-layout="calendar"] .calendar-host .ec-day-grid .ec-main.ec-uniform {
  overflow: auto;
}

/*
 * Empty weeks collapse under a budget, but only with max-per-day="off".
 *
 * The library floors every day cell at 5em (.ec-day-grid .ec-day), and
 * removes that floor only in uniform mode. So the non-uniform mode - the one
 * that actually sizes each week to its own content - still gave every empty
 * week 80px. Relaxing the floor to roughly the height of the date number
 * lets a week with no events shrink to it: measured on a real 25-event feed
 * at max-height="400px", the month went from six uniform 80px rows that
 * scrolled (511px) to 60/37/37/37/60/36 that does not scroll at all, with
 * the widget settling at 354px inside its 400px budget.
 *
 * Only while bounded, because unbounded there is no height to reclaim and
 * 5em is a better-looking month grid. Only with max-per-day="off", because
 * uniform mode already drops the floor itself - and the two cannot be
 * combined: a capped row needs a fixed height to cap against, while an auto
 * row grows to its content, so nothing ever overflows and the "+N more"
 * popover never triggers. That is the trade max-per-day="off" names.
 */
.ote-events[data-layout="calendar"] .calendar-host .ec-day-grid .ec-main:not(.ec-uniform) .ec-day {
  min-block-size: 2.2em;
}

.event {
  position: relative;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  overflow: hidden;
}

.event-clickable {
  cursor: pointer;
}

.event-clickable:hover,
.event-clickable:focus-visible {
  border-color: var(--ote-accent);
  outline: none;
}

/* Only reachable with show-past="true" — a past occurrence still opens and
   reads normally, it's just visually de-emphasized against upcoming ones. */
.event-past {
  opacity: 0.55;
}

.event-past:hover,
.event-past:focus-visible {
  opacity: 0.85;
}

/* group-events="...": layered "stack of cards" effect for a collapsed
   series/multi-part card. .event has overflow:hidden, which clips
   pseudo-elements but not the element's own box-shadow — same trick as
   .event-modal's shadow below. Kept within ul.events.layout-cards's 1rem
   gap so it doesn't visually collide with the next card. */
.layout-cards .event-stacked {
  box-shadow:
    0.3rem 0.3rem 0 -0.05rem var(--ote-surface),
    0.3rem 0.3rem 0 0 var(--ote-border),
    0.6rem 0.6rem 0 -0.05rem var(--ote-surface),
    0.6rem 0.6rem 0 0 var(--ote-border);
}

.layout-list .event {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid var(--ote-border);
  overflow: visible;
}

.layout-list .event:last-child {
  border-bottom: 0;
}

.event-list-header {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(10rem, max-content) max-content;
  gap: 1rem;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid var(--ote-border);
  background: var(--ote-accent-soft);
  color: var(--ote-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.event-header-icon {
  display: block;
  width: 0.9rem;
  height: 0.9rem;
  color: currentColor;
  justify-self: start;
}

.icon-updated {
  border: 1.6px solid currentColor;
  border-radius: 50%;
  position: relative;
}

.icon-updated::after {
  content: "";
  position: absolute;
  left: 0.38rem;
  top: 0.17rem;
  width: 0.22rem;
  height: 0.33rem;
  border-left: 1.6px solid currentColor;
  border-bottom: 1.6px solid currentColor;
}

.event-accordion {
  background: var(--ote-surface);
}

/* .event's overflow:hidden (for cards' flush-edge image corners) would
   otherwise clip .event-row-actions and, more importantly, its calendar
   .event-action-menu-items dropdown — that menu opens upward from a
   trigger pinned to the row's very top edge, so it has no room to render
   inside a clipped box. List rows have no flush-edge image relying on that
   clipping (.layout-list .event-details .event-image sets its own
   border-radius directly), so it's safe to opt back out here. */
.event-row {
  overflow: visible;
}

.event-summary {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(10rem, max-content) max-content;
  gap: 1rem;
  align-items: center;
  min-height: 3.25rem;
  padding: 0.7rem 1rem;
  cursor: pointer;
  list-style: none;
}

.event-summary::-webkit-details-marker {
  display: none;
}

.event-summary::after {
  content: none;
}

.event-summary:hover,
.event-summary:focus-visible {
  background: var(--ote-accent-soft);
  outline: none;
}

.event-summary-title {
  min-width: 0;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.event-summary-when,
.event-summary-updated {
  min-width: 0;
  color: var(--ote-muted);
  font-size: 0.875rem;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.event-details {
  padding: 0.2rem 1rem 1rem;
}

.event-details-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(13rem, 18rem);
  gap: 1rem;
  align-items: start;
}

.event-details-main,
.event-details-aside {
  min-width: 0;
  max-width: 100%;
}

.event-details-aside {
  padding-inline-start: 1rem;
  border-inline-start: 1px solid var(--ote-border);
}

.event-details-compact .event-details-content {
  grid-template-columns: 1fr;
  gap: 0.65rem;
}

.event-details-compact .event-details-aside {
  padding-inline-start: 0;
  border-inline-start: 0;
}

.event-details-compact .event-detail-list {
  grid-template-columns: minmax(4.5rem, max-content) minmax(0, 1fr) minmax(4.5rem, max-content) minmax(0, 1fr);
  gap: 0.35rem 0.85rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--ote-border);
}

.layout-list .event-details .event-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0 0 0.85rem;
  border-radius: var(--ote-radius);
}

.event-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.45rem;
  margin: 0.85rem 0 0;
}

.event-actions a,
.event-actions button,
.event-action-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-accent-soft);
  color: var(--ote-accent);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  list-style: none;
}

.event-action-menu-trigger::-webkit-details-marker {
  display: none;
}

.event-actions a:hover,
.event-actions a:focus-visible,
.event-actions button:hover,
.event-actions button:focus-visible,
.event-action-menu-trigger:hover,
.event-action-menu-trigger:focus-visible {
  border-color: var(--ote-accent);
  color: var(--ote-accent-hover);
  outline: none;
}

.event-action-menu {
  position: relative;
  z-index: 3;
}

.event-action-menu[open] .event-action-menu-trigger {
  border-color: var(--ote-accent);
}

.event-action-menu-items {
  position: absolute;
  inset-block-end: calc(100% + 0.25rem);
  inset-inline-start: 0;
  z-index: 4;
  display: grid;
  gap: 0.2rem;
  min-width: 13rem;
  max-width: calc(100vw - 3rem);
  margin: 0;
  padding: 0.3rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.12);
}

.event-action-menu-items a {
  justify-content: flex-start;
  width: 100%;
  border-color: transparent;
  background: transparent;
}

.event-preview-actions {
  padding-top: 0.65rem;
  border-top: 1px solid var(--ote-border);
}

/* Compact-row preview actions (layout="list"): a small trailing cluster
   overlaid on top of the collapsed row instead of stacked in the card body,
   so .event-preview-actions's padding-top/border-top (meant for that
   stacked layout) are reset here. .event already sets position:relative on
   the row <li>, so this only needs its own absolute position. Hidden until
   the row is hovered/focused on a fine-pointer device; always shown under
   (hover: none), (pointer: coarse) so touch users don't need a hover state
   that doesn't exist for them. */
.event-row-actions {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0.5rem;
  z-index: 3;
  align-items: center;
  height: 3.25rem;
  margin: 0;
  padding-top: 0;
  border-top: 0;
  border-radius: var(--ote-radius) 0 0 var(--ote-radius);
  background: var(--ote-accent-soft);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
}

.event-row:hover .event-row-actions,
.event-row:focus-within .event-row-actions {
  opacity: 1;
  pointer-events: auto;
}

@media (hover: none), (pointer: coarse) {
  .event-row-actions {
    opacity: 1;
    pointer-events: auto;
  }
}

.event-actions .event-action-danger {
  background: var(--ote-error-bg);
  color: var(--ote-error);
}

.event-actions [aria-pressed="true"] {
  border-color: var(--ote-accent);
  background: var(--ote-accent);
  color: var(--ote-surface);
}

.event-actions .event-action-danger:hover,
.event-actions .event-action-danger:focus-visible {
  border-color: var(--ote-error);
  color: var(--ote-error);
}

.action-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}

.event-detail-list {
  display: grid;
  grid-template-columns: minmax(5rem, max-content) minmax(0, 1fr);
  gap: 0.35rem 0.75rem;
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  min-width: 0;
  max-width: 100%;
}

.event-detail-list dt {
  min-width: 0;
  color: var(--ote-muted);
  font-weight: 700;
  overflow-wrap: anywhere;
}

.event-detail-list dd {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}

/* Cards layout: image (if any) is a full-width cover strip above the body. */
.layout-cards .event-body {
  padding: 0.9rem 1rem;
}

.layout-cards .event-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0;
}

.event-image {
  display: block;
  object-fit: cover;
  border-radius: var(--ote-radius);
  background: var(--ote-border);
}

.event-image-placeholder {
  background:
    linear-gradient(135deg, var(--ote-accent-soft), transparent 55%),
    linear-gradient(315deg, var(--ote-border), transparent 50%),
    var(--ote-surface);
}

.layout-cards .event-image {
  border-radius: 0;
}

.event-body {
  min-width: 0;
  flex: 1;
}

.event-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.event-title a {
  color: var(--ote-accent);
  text-decoration: none;
}

.event-title a:hover,
.event-title a:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
}

.event-location a {
  color: var(--ote-accent);
  text-decoration: none;
}

.event-location > span,
.event-location a {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-detail-list dd a {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
  color: var(--ote-accent);
  text-decoration: none;
}

.event-location a:hover,
.event-location a:focus-visible,
.event-detail-list dd a:hover,
.event-detail-list dd a:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
}

.event-when,
.event-location,
.event-organizer {
  margin: 0.15rem 0;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  font-size: 0.875rem;
  color: var(--ote-muted);
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin: 0.35rem 0;
  min-width: 0;
  max-width: 100%;
  font-size: 0.8125rem;
}

.event-meta .event-badges {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  margin: 0;
  font-size: inherit;
}

.event-meta .event-location {
  flex: 1 1 auto;
  margin: 0;
  font-size: inherit;
}

.event-description {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.event-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.35rem 0;
}

.badge,
.price {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  min-width: 0;
  max-width: 100%;
  font-size: 0.75rem;
  line-height: 1.4;
  background: var(--ote-accent-soft);
  color: var(--ote-accent);
}

/* eligibility/cfp badges, and a priced offer with a registration link, are
   sometimes rendered as <a> rather than <span> — undo the browser's default
   link underline, matching .event-description a's hover-only underline. */
a.badge,
a.price {
  text-decoration: none;
}

a.badge:hover,
a.badge:focus-visible,
a.price:hover,
a.price:focus-visible {
  text-decoration: underline;
}

/* Positioned after .badge so its background/color win the cascade
   (equal specificity, later rule wins) — this badge needs contrast against
   a photo, not the pill's usual accent-soft styling. */
.event-group-badge {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem;
  z-index: 2;
  background: rgb(0 0 0 / 0.55);
  color: #fff;
}

.badge-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}

.event-custom-badge-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.event-custom-badge-success {
  color: #157347;
}

.event-custom-badge-warning {
  color: #8a5a00;
}

.event-custom-badge-danger {
  background: var(--ote-error-bg);
  color: var(--ote-error);
}

.event-custom-badge .action-icon {
  width: 1em;
  height: 1em;
}

.event-meta .badge,
.event-meta .price {
  font-size: inherit;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.tag {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--ote-border);
  font-size: 0.75rem;
  color: var(--ote-muted);
}

.calendar-host {
  min-height: 20rem;
}

/* @event-calendar/core renders these event nodes; they open the same detail view as cards. */
.calendar-host .ec-event {
  cursor: pointer;
}

/*
 * max-per-day (see calendar-layout.ts#dayRowHeight). The library's
 * dayMaxEvents:true adds .ec-uniform, which sizes rows minmax(0, 1fr) — and
 * 1fr tracks in a grid of indefinite height grow to the tallest row's
 * content, so a 15-event day would make every week 15 events tall and hide
 * nothing. Pinning the row height is what actually caps a day and sends the
 * rest to the "+N more" popover.
 *
 * It has to be a rule rather than an inline style on the host: .ec-main is
 * the library's own element and sets --ec-row-height on itself, which beats
 * anything inherited. This stylesheet is injected before the library's in
 * the shadow root, so the selector is deliberately one class more specific.
 */
.calendar-host[data-day-rows] .ec-day-grid .ec-main.ec-uniform {
  --ec-row-height: var(--ote-calendar-row-height);
}

/*
 * density="compact" (#170). The comfortable metrics give a day cell a 41px
 * header and a 27px chip, so showing one event costs ~68px; Google
 * Calendar's embed does the same job in ~36px (measured: 20px date box,
 * 16px chip), which is why its month fits a small container with its events
 * still readable while ours fell back to "+N more" links.
 *
 * These three rules are the whole difference, and the numbers they produce
 * are measured in Chrome rather than reasoned about - CALENDAR_DENSITY in
 * calendar-layout.ts carries them, because the max-per-day row maths has to
 * agree with what the cell actually renders. Re-measure both together.
 */
.calendar-host[data-density="compact"] .ec-day-grid.ec-month-view .ec-day-head {
  padding: 0.12rem 0.25rem;
  font-size: 0.82em;
}

.calendar-host[data-density="compact"] .ec-event {
  padding: 0 2px;
  font-size: 0.76em;
  line-height: 1.35;
}

.calendar-host[data-density="compact"] .ec-col-head {
  padding: 0.15rem 0.2rem;
  font-size: 0.72em;
}

.calendar-host[data-density="compact"] .ec-day-foot {
  padding: 0 0.25rem 0.1rem;
  font-size: 0.72em;
}

/*
 * Weeks sized to their own content (calendar-layout.ts#weekRowTracks).
 *
 * This is the rule that lets a month collapse its empty weeks while keeping
 * max-per-day. --ec-row-height cannot: it is one value for every row, so
 * content-sizing it grows each cell to its events and the "+N more" popover
 * stops firing. A track list sets each week independently, and the library
 * still hides whatever does not fit a given cell.
 *
 * One class more specific than the library's own grid-template-rows, and on
 * our container rather than its element, so its re-render cannot drop it.
 */
.calendar-host[data-week-rows] .ec-day-grid .ec-main {
  grid-template-rows: var(--ote-calendar-week-rows);
}

/*
 * The events the day cap hides are still laid out - the library hides them
 * with visibility: hidden, which leaves them occupying space - so they
 * inflate .ec-main's scrollHeight far past the grid. Harmless while
 * .ec-main is overflow: hidden, but a bounded calendar turns that to auto,
 * and then a month that fits its budget still grew a 17px scrollbar that
 * scrolled 400px into blank space (measured: scrollHeight 707 against a
 * 297px grid).
 *
 * Clipping the event layer to the grid fixes both halves: a month that fits
 * has no scrollbar at all, and one that does not scrolls through its actual
 * weeks. The chips and their "+N more" links are untouched.
 */
.calendar-host[data-week-rows] .ec-day-grid .ec-body {
  overflow: hidden;
}

.event-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: grid;
  align-items: center;
  justify-items: center;
  padding: 1rem;
  background: rgb(0 0 0 / 0.45);
}

.event-modal {
  width: min(72rem, 100%);
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  overflow: auto;
  padding: 1.1rem 1.25rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  box-shadow: 0 1rem 3rem rgb(0 0 0 / 0.22);
}

.event-modal-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 0.75rem;
  align-items: start;
  margin: 0 0 1rem;
}

.event-modal-title {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.25;
}

.event-modal-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0 0.5rem;
}

/* Lives inside .event-detail-list's 2-column grid, right after the "When"
   row — span both columns so it sits on its own full-width row instead of
   being column-sized alongside the dt/dd label column. */
.event-detail-list .event-modal-nav {
  grid-column: 1 / -1;
}

.event-modal-nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: transparent;
  color: var(--ote-muted);
  cursor: pointer;
}

.event-modal-nav-button:hover,
.event-modal-nav-button:focus-visible {
  border-color: var(--ote-accent);
  color: var(--ote-accent);
  outline: none;
}

.event-modal-nav-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.event-modal-nav-icon {
  width: 1.1em;
  height: 1.1em;
}

.event-modal-nav-counter {
  font-size: 0.85rem;
  color: var(--ote-muted);
}

.event-modal-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(15rem, 22rem);
  gap: 1.25rem;
  align-items: start;
}

.event-modal-main {
  min-width: 0;
}

.event-modal-aside {
  min-width: 0;
  padding-inline-start: 1.25rem;
  border-inline-start: 1px solid var(--ote-border);
}

.event-modal-compact {
  width: min(56rem, 100%);
}

.event-modal-compact .event-modal-content {
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.event-modal-compact .event-modal-aside {
  padding-inline-start: 0;
  border-inline-start: 0;
}

.event-modal-compact .event-detail-list {
  grid-template-columns: minmax(4.5rem, max-content) minmax(0, 1fr) minmax(4.5rem, max-content) minmax(0, 1fr);
  gap: 0.45rem 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--ote-border);
}

.event-modal-close {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: transparent;
  color: var(--ote-muted);
  font: inherit;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.event-modal-close:hover,
.event-modal-close:focus-visible {
  border-color: var(--ote-accent);
  color: var(--ote-accent);
  outline: none;
}

.event-modal .event-image {
  width: 100%;
  height: clamp(8rem, 22vh, 12rem);
  margin: 0 0 0.85rem;
  object-fit: cover;
}

.event-modal .event-description {
  margin-top: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.event-modal .event-badges {
  margin: 0 0 0.75rem;
}

.event-modal .event-detail-list {
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.event-modal > .event-actions {
  margin: 1.1rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--ote-border);
}

.event-description > * {
  margin: 0.45rem 0 0;
}

.event-description > :first-child {
  margin-top: 0;
}

.event-description ul,
.event-description ol {
  padding-left: 1.25rem;
}

.event-description h1,
.event-description h2,
.event-description h3,
.event-description h4,
.event-description h5,
.event-description h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--ote-text);
}

.event-description h1 {
  font-size: 1.3em;
}

.event-description h2 {
  font-size: 1.2em;
}

.event-description h3 {
  font-size: 1.1em;
}

.event-description h4,
.event-description h5,
.event-description h6 {
  font-size: 1em;
}

.event-description code {
  padding: 0.05rem 0.25rem;
  border-radius: 4px;
  background: var(--ote-accent-soft);
  color: var(--ote-text);
}

.event-description a {
  color: var(--ote-accent);
  text-decoration: none;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.event-description a:hover,
.event-description a:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
}

@media (max-width: 64rem) {
  .event-details-content {
    grid-template-columns: 1fr;
  }

  .event-details-aside {
    order: -1;
    padding-inline-start: 0;
    padding-bottom: 0.75rem;
    border-inline-start: 0;
    border-bottom: 1px solid var(--ote-border);
  }

  .layout-list .event-details .event-image {
    width: min(100%, 20rem);
  }
}

@media (max-width: 40rem) {
  .event-list-header {
    display: none;
  }

  .event-summary {
    grid-template-columns: 1fr;
    gap: 0.25rem 0.75rem;
  }

  .event-summary-title {
    grid-column: 1;
  }

  .event-summary-when,
  .event-summary-updated {
    grid-column: 1;
  }

  /* The summary stacks into multiple lines at this width, so pinning the
     actions to the top-right (the desktop overlay position) would sit on
     top of the title text. Drop into normal flow, right after the row,
     instead — still always visible per the touch media query above. */
  .event-row-actions {
    position: static;
    height: auto;
    justify-content: flex-end;
    padding: 0 1rem 0.6rem;
    border-radius: 0;
    background: none;
  }

  .event-detail-list {
    grid-template-columns: 1fr;
  }

  .event-details-compact .event-detail-list {
    grid-template-columns: 1fr;
  }

  .event-modal-compact .event-detail-list {
    grid-template-columns: 1fr;
  }

  .event-modal {
    padding: 1rem;
  }

  .event-modal-content {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .event-modal-aside {
    order: -1;
    padding-inline-start: 0;
    padding-bottom: 0.85rem;
    border-inline-start: 0;
    border-bottom: 1px solid var(--ote-border);
  }
}

/*
 * The header (#183): the chrome row above the events, in every layout.
 *
 * Google Calendar's order, because it is the one a visitor arrives with:
 * Today and the month arrows on the left, the title beside them, the view
 * control floating right. Same flex: none as .footer and for the same
 * reason — it is chrome, so it keeps its height and the event area absorbs
 * what is left of the budget.
 *
 * The library's own toolbar is switched off (calendar-layout.ts), so this
 * row is the only one: the two used to stack, and together they cost about
 * 76px of a budget that is often 300.
 *
 * No wrapping, deliberately: the row reports its overflow through
 * scrollWidth and element.ts steps the density down instead (see
 * #fitHeader). A row that wrapped would always fit, and so would never ask
 * for the smaller control that actually belongs at that width.
 */
.ote-header {
  display: flex;
  flex: none;
  align-items: center;
  gap: 0.75rem;
  margin-block-end: 0.75rem;
  min-width: 0;
  /* Past the last density step there is nothing left to drop, and a row
     that spills into the events is worse than one that is cut off. */
  overflow: hidden;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
}

/*
 * The month is the one thing here allowed to take the room, and the one
 * thing that may truncate — but not to nothing.
 *
 * The min-width is what makes the row's overflow a usable signal: without
 * it the title shrinks to zero and the header always "fits", so
 * element.ts#fitHeader would never see a reason to drop anything.
 *
 * 7.5rem is "a month and a year", measured: at 4.5rem the labels survived
 * down to a 360px widget while "November 2026" was already cut to
 * "Novemb…" — the wrong thing given up first. The floor buys the month its
 * room and makes the view labels pay for it, which is the order a visitor
 * would choose.
 */
.header-title {
  flex: 0 1 auto;
  min-width: 7.5rem;
  margin-inline-start: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ote-text);
}

.header-today,
.header-arrow,
.view-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ote-muted);
  font: inherit;
  font-size: 0.8125rem;
  line-height: 1.2;
  cursor: pointer;
}

.header-today {
  padding: 0.3rem 0.6rem;
  border-color: var(--ote-border);
  border-radius: var(--ote-radius);
  white-space: nowrap;
}

.header-arrow {
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border-radius: 50%;
}

.header-today:hover:not(:disabled),
.header-arrow:hover:not(:disabled) {
  background: var(--ote-surface);
  color: var(--ote-text);
}

.header-today:focus-visible,
.header-arrow:focus-visible,
.view-button:focus-visible,
.view-select:focus-visible {
  color: var(--ote-text);
  outline: 2px solid var(--ote-accent);
  outline-offset: 1px;
}

/* Disabled means "you are already here" (Today) or "the calendar has not
   reported a month yet" (the arrows) — both are states, not failures, so
   they fade rather than look broken. */
.header-today:disabled,
.header-arrow:disabled {
  opacity: 0.45;
  cursor: default;
}

.header-arrow-icon {
  width: 1rem;
  height: 1rem;
}

/*
 * The view control. The segmented group is the playground's own
 * .segmented-toolbar (apps/embed/styles.css) ported to the --ote-* tokens,
 * so the control a publisher configures and the one their visitor clicks
 * are visibly the same control.
 */
/* margin-inline-start: auto, not justify-content on the row: in list and
   cards there is no nav beside it, and space-between alone would swing the
   control to the left exactly when the visitor switched views. Measured:
   it moved 513px. */
.view-switcher,
.view-select-wrapper {
  margin-inline-start: auto;
}

.view-switcher {
  display: inline-flex;
  flex: none;
  gap: 0.25rem;
  padding: 0.2rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
}

.view-button {
  padding: 0.3rem 0.55rem;
  border-radius: calc(var(--ote-radius) - 2px);
}

.view-button:hover {
  color: var(--ote-text);
  border-color: var(--ote-border);
}

.view-button[aria-pressed="true"] {
  background: var(--ote-accent-soft);
  border-color: var(--ote-border);
  color: var(--ote-accent);
  font-weight: 600;
}

.view-icon {
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  flex: none;
}

/*
 * At the last step there is nothing left to drop, so the floor goes too:
 * the row clips from its end (overflow: hidden above), and what sits at
 * the end is the view control — the one thing a visitor at 320px still
 * needs. Measured: the nav wanted 35px more at 320px and 75px at 280px,
 * all of it the title's floor.
 */
.ote-events[data-header="menu"] .header-title {
  min-width: 0;
}

/*
 * data-header is written by element.ts after measuring the row, because a
 * media query inside a shadow root follows the viewport and this widget
 * lives in a column (the #169 mistake, re-made by this row once and
 * removed again). "icons" keeps every label in the DOM and only hides it
 * visually, so each button keeps its accessible name; clip rather than
 * display: none is what makes that true.
 */
.ote-events[data-header="icons"] .view-button-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.ote-events[data-header="icons"] .view-button {
  padding: 0.3rem 0.45rem;
}

/*
 * The last step down is a native select, not a hand-built menu: the
 * platform renders its popup in the top layer with its own keyboard and
 * touch behaviour, and there is no "clicked outside" to detect — which is
 * the one thing a menu inside a shadow root gets wrong (see
 * suppressRetargetedOutsideEvents in calendar-layout.ts).
 */
.view-select-wrapper {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  color: var(--ote-accent);
}

.view-select {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

/*
 * The library's toolbar is configured empty (calendar-layout.ts) but still
 * renders its container, and an empty 40px strip above the grid is exactly
 * the room this header set out to give back.
 */
.calendar-host .ec-toolbar {
  display: none;
}

/*
 * The footer (#68): feed name and time zone on one side, <ote-subscribe>
 * and the OTE mark on the other.
 *
 * flex: none is load-bearing — it is chrome, so it keeps its height and
 * the event area absorbs the budget. No background, for the same reason
 * :host has none: the strip has to sit on whatever the host page is
 * painted with, and only its top border separates it from the events.
 */
.footer {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem 1rem;
  margin-block-start: 0.75rem;
  padding-block-start: 0.6rem;
  border-block-start: 1px solid var(--ote-border);
  font-size: 0.8125rem;
  color: var(--ote-muted);
}

/*
 * Stacked, not inline: the name and the zone answer different questions
 * ("whose feed is this" / "whose clock are these times on"), and side by
 * side at a typical embed width the zone reads as part of the name. Two
 * short lines also cost less height than one line that wraps — measured at
 * 360px wide, where the inline version took three lines.
 */
.footer-meta {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  min-width: 0;
}

.footer-zone {
  font-size: 0.75rem;
}

/*
 * The name truncates rather than pushing the actions onto a third row:
 * with flex: 1 1 auto on .footer-meta above, a long title shrinks and
 * ellipsises, keeping the strip two lines at widths where it used to be
 * three. The full title stays reachable in the tooltip.
 */
.footer-feed {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  color: var(--ote-text);
}

a.footer-feed {
  color: var(--ote-accent);
  text-decoration: none;
}

a.footer-feed:hover,
a.footer-feed:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
  outline: none;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-inline-start: auto;
}

/* The mark is the quietest thing in the strip on purpose: it is provenance,
   not an action. An earlier draft gave it a bordered pill, which read as a
   fourth button next to the subscribe badges — exactly what it must not
   be. Plain muted text, underlined only on hover. */
.footer-mark {
  font-size: 0.75rem;
  color: var(--ote-muted);
  text-decoration: none;
  white-space: nowrap;
}

.footer-mark:hover,
.footer-mark:focus-visible {
  color: var(--ote-accent);
  text-decoration: underline;
  outline: none;
}

@media (max-width: 480px) {
  /* Two lines rather than a name truncated to nothing: the strip's left
     side is the only part that can be long. */
  .footer {
    justify-content: flex-start;
  }

  .footer-actions {
    margin-inline-start: 0;
  }
}
`;
