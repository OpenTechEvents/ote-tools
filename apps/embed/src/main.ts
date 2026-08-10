import { defineOteEvents } from "./element.js";

defineOteEvents();

export {
  defineOteEvents,
  type OteEventsElement,
  type OteEventsFeedData,
  type OteEventsFeedObject,
} from "./element.js";
export type {
  CustomEventAction,
  EventAction,
  EventActionResolver,
  EventActionIcon,
  EventActionPlacement,
  EventActionVariant,
  EventActionsInput,
  EventBadge,
  EventBadgesResolver,
  EventClassNameResolver,
  EventFeedSource,
  EventRenderContext,
  NativeEventActionConfig,
  OriginalOteEvent,
} from "./render.js";
