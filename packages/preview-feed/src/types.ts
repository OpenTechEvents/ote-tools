export interface PreviewEventPartOf {
  id: string;
  type: "series" | "multipart";
  name?: string;
  url?: string;
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
  price?: { amount: number; currency?: string };
  organizerName?: string;
  tags?: string[];
  attendanceMode?: "in-person" | "online" | "hybrid";
  updatedAt?: string;
  partOf?: PreviewEventPartOf;
}

export interface PreviewFeed {
  title?: string;
  description?: string;
  license?: string;
  events: PreviewEvent[];
}
