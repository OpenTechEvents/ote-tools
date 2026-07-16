/**
 * Location picker for the geo field: Leaflet + OSM tiles + Nominatim search.
 * Click the map (or drag the pin) to set coordinates; searching a place name
 * centers the map and drops the pin on the first match the user picks.
 * DOM/network layer, tested by hand like the rest of ui/.
 */

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface GeoMapHandle {
  /** Moves the pin (e.g. when the user edits the lat/lon inputs by hand). */
  setPosition(lat: number, lon: number): void;
  destroy(): void;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

async function nominatim(query: string, limit: number): Promise<NominatimResult[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=${limit}&q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) return [];
    return (await response.json()) as NominatimResult[];
  } catch {
    return [];
  }
}

/** First Nominatim hit for a free-text query, or null. */
export async function geocode(
  query: string,
): Promise<{ lat: number; lon: number } | null> {
  const [hit] = await nominatim(query, 1);
  if (!hit) return null;
  const lat = Number(hit.lat);
  const lon = Number(hit.lon);
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
}

/**
 * Best-effort geocoding of a venue string ("name, street, city…"), used to
 * propose a map pin for imported events that carry an address but no
 * coordinates. Venue names confuse Nominatim, so failing the full string it
 * retries without the leading name, then without short region codes
 * ("…, AL"). Null when nothing matches — the caller never guesses.
 */
export async function geocodeVenue(
  venue: string,
): Promise<{ lat: number; lon: number } | null> {
  const parts = venue.split(",").map((s) => s.trim()).filter(Boolean);
  const variants = [venue];
  if (parts.length > 1) variants.push(parts.slice(1).join(", "));
  const noShort = parts.slice(1).filter((p) => p.length > 3);
  if (noShort.length > 0) variants.push(noShort.join(", "));
  let first = true;
  for (const query of [...new Set(variants)]) {
    // Nominatim's usage policy asks for at most one request per second.
    if (!first) await new Promise((resolve) => setTimeout(resolve, 1100));
    first = false;
    const hit = await geocode(query);
    if (hit !== null) return hit;
  }
  return null;
}

const PIN = L.divIcon({
  className: "geo-pin",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** 5 decimals ≈ 1m precision; more is noise in the JSON. */
function round(value: number): number {
  return Math.round(value * 1e5) / 1e5;
}

export function mountGeoMap(
  container: HTMLElement,
  initial: { lat: number; lon: number } | null,
  onChange: (lat: number, lon: number) => void,
  initialQuery = "",
): GeoMapHandle {
  // --- search box ---------------------------------------------------------
  const searchRow = document.createElement("div");
  searchRow.className = "geo-search";
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search a place (Nominatim / OpenStreetMap)…";
  // Seeded with the venue text so the address never has to be typed twice.
  searchInput.value = initialQuery;
  const searchButton = document.createElement("button");
  searchButton.type = "button";
  searchButton.textContent = "Search";
  searchRow.append(searchInput, searchButton);

  const results = document.createElement("ul");
  results.className = "geo-results";
  results.hidden = true;

  const mapDiv = document.createElement("div");
  mapDiv.className = "geo-map";

  container.append(searchRow, results, mapDiv);

  // --- map + pin ------------------------------------------------------------
  const map = L.map(mapDiv, { worldCopyJump: true });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let marker: L.Marker | null = null;

  function place(lat: number, lon: number, emit: boolean): void {
    if (marker === null) {
      marker = L.marker([lat, lon], { icon: PIN, draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const at = marker!.getLatLng();
        onChange(round(at.lat), round(at.lng));
      });
    } else {
      marker.setLatLng([lat, lon]);
    }
    if (emit) onChange(round(lat), round(lon));
  }

  if (initial !== null) {
    map.setView([initial.lat, initial.lon], 14);
    place(initial.lat, initial.lon, false);
  } else {
    map.setView([25, 0], 2);
  }

  map.on("click", (e: L.LeafletMouseEvent) => {
    place(e.latlng.lat, e.latlng.lng, true);
  });

  // --- Nominatim search -----------------------------------------------------
  async function search(): Promise<void> {
    const query = searchInput.value.trim();
    if (!query) return;
    results.textContent = "";
    results.hidden = false;
    const loading = document.createElement("li");
    loading.textContent = "Searching…";
    results.append(loading);
    const found = await nominatim(query, 5);
    results.textContent = "";
    if (found.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No results.";
      results.append(li);
      return;
    }
    for (const hit of found) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = hit.display_name;
      button.addEventListener("click", () => {
        const lat = Number(hit.lat);
        const lon = Number(hit.lon);
        map.setView([lat, lon], 15);
        place(lat, lon, true);
        results.hidden = true;
      });
      li.append(button);
      results.append(li);
    }
  }

  searchButton.addEventListener("click", () => void search());
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void search();
    }
  });

  return {
    setPosition(lat: number, lon: number): void {
      place(lat, lon, false);
      map.setView([lat, lon], Math.max(map.getZoom(), 10));
    },
    destroy(): void {
      map.remove();
    },
  };
}
