/**
 * The checkable occurrence list shared by "Edit series" and "Delete
 * series" — a checkbox per occurrence in a group, with the same
 * future-preselected / past-or-cancelled-marker pattern the recurring-
 * series import dialog already established (main.ts's showDetected), plus
 * an optional inline date/time editor per row (Edit series only — Delete
 * series has no use for it).
 */

import { splitWallClock } from "../lib/event-json.js";
import { isFutureEvent } from "../lib/import.js";
import type { ListedEvent } from "../lib/types.js";

export interface OccurrenceChecklistOptions {
  /** Edit series: per-row date/time inputs. Delete series: none needed. */
  editableDates?: boolean;
  defaultChecked(member: ListedEvent, todayIso: string): boolean;
  label(member: ListedEvent): string;
  pastLabel: string;
  cancelledLabel: string;
}

export interface OccurrenceDateOverride {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface OccurrenceChecklistHandle {
  getChecked(): ListedEvent[];
  /** Only rows that are checked AND whose start or end date/time was
   * actually edited from the occurrence's own original value — keyed by
   * slug. Empty map when `editableDates` is off. */
  getDateOverrides(): Map<string, OccurrenceDateOverride>;
  /** Fires on any checkbox/date/time change, to re-gate a confirm button. */
  onChange(callback: () => void): void;
}

interface Row {
  member: ListedEvent;
  box: HTMLInputElement;
  startDateInput?: HTMLInputElement;
  startTimeInput?: HTMLInputElement;
  endDateInput?: HTMLInputElement;
  endTimeInput?: HTMLInputElement;
}

export function renderOccurrenceChecklist(
  container: HTMLUListElement,
  members: readonly ListedEvent[],
  options: OccurrenceChecklistOptions,
): OccurrenceChecklistHandle {
  container.textContent = "";
  container.hidden = members.length === 0;
  const listeners: Array<() => void> = [];
  const notify = () => listeners.forEach((callback) => callback());
  const today = new Date().toISOString();
  const rows: Row[] = [];

  for (const member of members) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = options.defaultChecked(member, today);
    box.addEventListener("input", notify);
    label.append(box, ` ${options.label(member)}`);

    const future = isFutureEvent(member.event, today);
    const cancelled = member.event.status === "cancelled";
    if (!future || cancelled) {
      const marker = document.createElement("span");
      marker.className = "import-past";
      marker.textContent = cancelled ? options.cancelledLabel : options.pastLabel;
      label.append(" ", marker);
    }
    li.append(label);

    let startDateInput: HTMLInputElement | undefined;
    let startTimeInput: HTMLInputElement | undefined;
    let endDateInput: HTMLInputElement | undefined;
    let endTimeInput: HTMLInputElement | undefined;
    if (options.editableDates) {
      const start = splitWallClock(member.event.startDate);
      const end = splitWallClock(member.event.endDate);
      const wrap = document.createElement("span");
      wrap.className = "occurrence-date-inputs";
      startDateInput = document.createElement("input");
      startDateInput.type = "date";
      startDateInput.value = start.date;
      startDateInput.addEventListener("input", notify);
      startTimeInput = document.createElement("input");
      startTimeInput.type = "time";
      startTimeInput.value = start.time;
      startTimeInput.addEventListener("input", notify);
      const arrow = document.createElement("span");
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");
      endDateInput = document.createElement("input");
      endDateInput.type = "date";
      endDateInput.value = end.date;
      endDateInput.addEventListener("input", notify);
      endTimeInput = document.createElement("input");
      endTimeInput.type = "time";
      endTimeInput.value = end.time;
      endTimeInput.addEventListener("input", notify);
      wrap.append(startDateInput, startTimeInput, arrow, endDateInput, endTimeInput);
      li.append(wrap);
    }

    container.append(li);
    rows.push({ member, box, startDateInput, startTimeInput, endDateInput, endTimeInput });
  }

  return {
    getChecked(): ListedEvent[] {
      return rows.filter((row) => row.box.checked).map((row) => row.member);
    },
    getDateOverrides(): Map<string, OccurrenceDateOverride> {
      const overrides = new Map<string, OccurrenceDateOverride>();
      if (!options.editableDates) return overrides;
      for (const row of rows) {
        if (
          !row.box.checked ||
          row.member.slug === null ||
          !row.startDateInput ||
          !row.startTimeInput ||
          !row.endDateInput ||
          !row.endTimeInput
        ) {
          continue;
        }
        if (!row.startDateInput.value) continue;
        const originalStart = splitWallClock(row.member.event.startDate);
        const originalEnd = splitWallClock(row.member.event.endDate);
        const current: OccurrenceDateOverride = {
          startDate: row.startDateInput.value,
          startTime: row.startTimeInput.value,
          endDate: row.endDateInput.value,
          endTime: row.endTimeInput.value,
        };
        const unchanged =
          current.startDate === originalStart.date &&
          current.startTime === originalStart.time &&
          current.endDate === originalEnd.date &&
          current.endTime === originalEnd.time;
        if (unchanged) continue;
        overrides.set(row.member.slug, current);
      }
      return overrides;
    },
    onChange(callback: () => void): void {
      listeners.push(callback);
    },
  };
}
