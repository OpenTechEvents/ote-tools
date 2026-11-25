export interface PreviewOffer {
  name?: string;
  /** Absent `scope` is read as `admission` — see the OTE spec, D032. */
  scope?: "admission" | "add-on";
  price?: number;
  currency?: string;
  url?: string;
}

export interface PreviewEventPartOf {
  id: string;
  type: "series" | "multipart";
  name?: string;
  url?: string;
  /**
   * The set's **shared admission**: what attending the whole thing costs,
   * written identically on every part. Kept here, rather than dropped, for
   * the reason D032 names — a consumer that needs correct pricing must read
   * it, and a part with no `offers` of its own is *covered* by it, the one
   * place an absent offers list means something other than unknown.
   */
  offers?: PreviewOffer[];
}

/**
 * What it costs to attend, and **how that was arrived at**.
 *
 * `basis` exists because a single number cannot carry the difference, and
 * getting it wrong produces false pricing rather than missing pricing — the
 * one trade the spec refuses. An `add-on` offer is a surcharge on the set's
 * admission, so a renderer that prints its 20 € as the price tells an
 * attendee a talk costs 20 when it costs 200.
 *
 * `amount` is optional for the same reason: when a part carries a priced
 * add-on and the document gives no priced shared admission, the surcharge is
 * known and the total is not. The spec's words for that case are "an
 * additional charge, total unknown", and this type can say exactly that.
 */
export interface PreviewPrice {
  /** The total cost of attending, when it can be computed. */
  amount?: number;
  currency?: string;
  /** Where the number was quoted — the ticket link, when the offer had one. */
  url?: string;
  basis: PreviewPriceBasis;
}

export type PreviewPriceBasis =
  /** This part's own admission offer. */
  | "own"
  /** No own offers: covered by the set's shared admission. */
  | "shared"
  /** The set's admission plus this part's surcharge. */
  | "shared-plus-add-on"
  /** A surcharge with no priced shared admission to add it to: total unknown. */
  | "add-on-only";

export interface PreviewEventEligibility {
  type: "open" | "members-only" | "approval-required" | "restricted";
  note?: string;
  url?: string;
}

export interface PreviewEventCfp {
  url: string;
  opensAt?: string;
  closesAt?: string;
  coversTravel?: boolean;
  coversAccommodation?: boolean;
}

export interface PreviewEvent {
  id?: string;
  name: string;
  startDate?: string;
  endDate?: string;
  timezone?: string;
  dateLabel?: string;
  location?: string;
  locationLink?: string;
  link?: string;
  description?: string;
  details?: Array<{ label: string; value: string }>;
  image?: { url: string; alt?: string };
  price?: PreviewPrice;
  organizerName?: string;
  tags?: string[];
  attendanceMode?: "in-person" | "online" | "hybrid";
  updatedAt?: string;
  partOf?: PreviewEventPartOf;
  eligibility?: PreviewEventEligibility;
  cfp?: PreviewEventCfp;
}

export interface PreviewFeed {
  title?: string;
  description?: string;
  license?: string;
  events: PreviewEvent[];
}
