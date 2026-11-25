/**
 * The words the exporters put in front of a reader, in the languages this kit
 * speaks.
 *
 * It lives here because `export-ics`, `export-rss` and `export-rss`'s own
 * parser all need the same table, and all three already depend on this
 * package. Three copies is what it had: the labels inline in each exporter
 * (with the eligibility, status and attendance dictionaries duplicated
 * between them) and a third list inside `rssToPreviewFeed`, whose job is to
 * recognise the labels the exporter just wrote. A label added to two of the
 * three reads, in the output, as a feature that half works.
 *
 * Adding a language is one object here, and `LABEL_LOCALES` keeps the test
 * honest about every key being present. It is not a general i18n framework
 * and does not want to be: these are the handful of field names an exporter
 * writes, never publisher content, which is passed through untranslated —
 * this kit does not machine translate.
 */

/** The label keys an exporter may ask for. */
export interface Labels {
  event: string;
  online: string;
  address: string;
  organizers: string;
  movedOnline: string;
  cfp: string;
  closes: string;
  eligibility: string;
  speakers: string;
  recording: string;
  tickets: string;
  addOn: string;
  free: string;
  freeLower: string;
  admission: string;
  admissionLower: string;
  wholeEventAdmission: string;
  status: string;
  when: string;
  where: string;
  attendance: string;
  partOf: string;
  /** `status`, `eligibility.type` and `attendanceMode` enum values. */
  values: Record<string, string>;
  /** Title prefixes for a status that is not `scheduled`; `scheduled` is empty. */
  statusPrefixes: Record<string, string>;
}

const en: Labels = {
  event: "Event",
  online: "Online",
  address: "Address",
  organizers: "Organizers",
  movedOnline: "This event has moved online.",
  cfp: "Call for proposals",
  closes: "closes",
  eligibility: "Eligibility",
  speakers: "Speakers",
  recording: "Recording",
  tickets: "Tickets",
  addOn: "additional charge on top of admission",
  free: "Free",
  freeLower: "free",
  admission: "Admission",
  admissionLower: "admission",
  wholeEventAdmission: "Admission (whole event)",
  status: "Status",
  when: "When",
  where: "Where",
  attendance: "Attendance",
  partOf: "Part of",
  // The spec's enum values are already English, and the exporters printed
  // them verbatim: every one of these must stay identical to its key, or an
  // English feed's output changes. Written out rather than derived so that a
  // locale missing a value is a missing key here, not a silent fallthrough.
  values: {
    tentative: "tentative", cancelled: "cancelled", postponed: "postponed",
    rescheduled: "rescheduled", "moved-online": "moved-online",
    open: "open", "members-only": "members-only",
    "approval-required": "approval-required", restricted: "restricted",
    "in-person": "in-person", online: "online", hybrid: "hybrid",
  },
  statusPrefixes: {
    scheduled: "", tentative: "[Tentative] ", cancelled: "[Cancelled] ",
    postponed: "[Postponed] ", rescheduled: "[Rescheduled] ",
    "moved-online": "[Moved online] ",
  },
};

const es: Labels = {
  event: "Evento",
  online: "En línea",
  address: "Dirección",
  organizers: "Organizadores",
  movedOnline: "Este evento se ha trasladado en línea.",
  cfp: "Convocatoria de ponencias",
  closes: "cierra",
  eligibility: "Requisitos",
  speakers: "Ponentes",
  recording: "Grabación",
  tickets: "Entradas",
  addOn: "cargo adicional a la entrada",
  free: "Gratis",
  freeLower: "gratis",
  admission: "Entrada",
  admissionLower: "entrada",
  wholeEventAdmission: "Entrada (evento completo)",
  status: "Estado",
  when: "Cuándo",
  where: "Dónde",
  attendance: "Modalidad",
  partOf: "Parte de",
  values: {
    tentative: "por confirmar", cancelled: "cancelado", postponed: "aplazado",
    rescheduled: "reprogramado", "moved-online": "trasladado en línea",
    open: "abierto", "members-only": "solo para miembros",
    "approval-required": "requiere aprobación", restricted: "restringido",
    "in-person": "presencial", online: "en línea", hybrid: "híbrido",
  },
  statusPrefixes: {
    scheduled: "", tentative: "[Por confirmar] ", cancelled: "[Cancelado] ",
    postponed: "[Aplazado] ", rescheduled: "[Reprogramado] ",
    "moved-online": "[Trasladado en línea] ",
  },
};

/** Every language with its own labels, keyed by primary subtag. */
export const LABELS: Record<string, Labels> = { en, es };

/** The primary subtags `labelsFor` can answer with something other than English. */
export const LABEL_LOCALES: readonly string[] = Object.keys(LABELS);

/**
 * The labels for a BCP-47 tag, falling back to English.
 *
 * Only the primary subtag decides: `es-MX` and `es-419` get Spanish, because
 * a field name is not where regional variation lives. A language this kit has
 * no labels for gets English rather than a half-translated page, and the
 * caller is expected to say so where it matters — publisher text is still
 * served in whatever language the publisher wrote it.
 */
export function labelsFor(locale?: string): Labels {
  const primary = locale?.split("-")[0]?.toLowerCase() ?? "";
  return LABELS[primary] ?? en;
}

/** An enum value in `locale`, or the value itself when it has no translation. */
export function labelValue(value: string, locale?: string): string {
  return labelsFor(locale).values[value] ?? value;
}
