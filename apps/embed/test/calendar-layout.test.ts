import { describe, expect, it } from "vitest";

import { calendarLocaleOptions } from "../src/calendar-layout.js";

describe("calendarLocaleOptions", () => {
  it("localizes the calendar for Spanish", () => {
    const options = calendarLocaleOptions("es");
    expect(options).toMatchObject({
      locale: "es-ES",
      firstDay: 1,
      buttonText: { prev: "Mes anterior", next: "Mes siguiente" },
      dayHeaderFormat: { weekday: "short" },
    });
    expect((options.titleFormat as (date: Date) => string)(new Date("2026-08-01T00:00:00Z"))).toBe(
      "Agosto de 2026",
    );
  });

  it("keeps the English calendar defaults explicit", () => {
    expect(calendarLocaleOptions("en")).toMatchObject({
      locale: "en-US",
      firstDay: 0,
      buttonText: { prev: "Previous month", next: "Next month" },
    });
  });
});
