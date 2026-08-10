import { defineOteEvents } from "./element.js";

defineOteEvents();

export { defineOteEvents, type OteEventsElement } from "./element.js";
export type {
  CustomEventAction,
  EventAction,
  EventActionIcon,
  EventActionPlacement,
  EventActionVariant,
} from "./render.js";
