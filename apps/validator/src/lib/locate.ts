/**
 * Turning "this field is wrong" into "this *line* is wrong".
 *
 * A validation error the user cannot find in their own file is a riddle, so
 * every finding is rendered against the source text. That needs two things
 * the validator does not give us: a JSON Pointer (it reports readable paths
 * like `events[0].startDate`) and the position of that pointer in the bytes
 * the user pasted. Both live here.
 *
 * The index is built by scanning the source once, not by re-parsing per
 * error: a feed with 200 findings would otherwise walk the document 200
 * times.
 */

/** Where a value sits in the source text. Lines and columns are 1-based. */
export interface SourcePosition {
  offset: number;
  line: number;
  column: number;
}

/**
 * Converts `@opentechevents/validate`'s readable path into a JSON Pointer
 * (RFC 6901): `events[0].location.address` → `/events/0/location/address`.
 *
 * `(document)` — that package's name for the root — becomes the empty
 * pointer. The conversion is best-effort by construction: the readable form
 * is lossy for keys that themselves contain `.` or `[`, which no OTE field
 * does. When it cannot be mapped the caller simply gets no line number, never
 * a wrong one.
 */
export function pathToPointer(path: string): string {
  if (!path || path === "(document)") return "";
  const segments: string[] = [];
  for (const part of path.split(".")) {
    const match = /^([^[\]]*)((?:\[\d+\])*)$/.exec(part);
    if (!match) return "";
    if (match[1]) segments.push(match[1]);
    for (const index of match[2].matchAll(/\[(\d+)\]/g)) segments.push(index[1]);
  }
  return segments.map((segment) => `/${escapePointerSegment(segment)}`).join("");
}

function escapePointerSegment(segment: string): string {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}

/** Renders a pointer for display; the root gets a name rather than "". */
export function formatPointer(pointer: string): string {
  return pointer === "" ? "(document root)" : pointer;
}

interface Cursor {
  index: number;
  line: number;
  column: number;
}

/**
 * A JSON scanner that records where every value starts.
 *
 * Deliberately its own scanner rather than a parser library: it must accept
 * exactly what `JSON.parse` accepts (the document has already been parsed by
 * the time this runs), report positions, and never execute anything from a
 * document that is, by definition, a stranger's.
 */
class Indexer {
  private readonly positions = new Map<string, SourcePosition>();
  private readonly cursor: Cursor;

  constructor(private readonly source: string) {
    this.cursor = { index: 0, line: 1, column: 1 };
  }

  index(): Map<string, SourcePosition> {
    this.skipWhitespace();
    this.value("");
    return this.positions;
  }

  private at(): string {
    return this.source[this.cursor.index] ?? "";
  }

  private advance(count = 1): void {
    for (let i = 0; i < count && this.cursor.index < this.source.length; i++) {
      if (this.source[this.cursor.index] === "\n") {
        this.cursor.line++;
        this.cursor.column = 1;
      } else {
        this.cursor.column++;
      }
      this.cursor.index++;
    }
  }

  private skipWhitespace(): void {
    while (/[\s]/.test(this.at()) && this.at() !== "") this.advance();
  }

  private position(): SourcePosition {
    return { offset: this.cursor.index, line: this.cursor.line, column: this.cursor.column };
  }

  private value(pointer: string): void {
    this.skipWhitespace();
    this.positions.set(pointer, this.position());
    const char = this.at();
    if (char === "{") return this.object(pointer);
    if (char === "[") return this.array(pointer);
    if (char === '"') {
      this.string();
      return;
    }
    // Number, true, false, null: consume until a structural character.
    while (this.at() !== "" && !/[\s,\]}]/.test(this.at())) this.advance();
  }

  private object(pointer: string): void {
    this.advance(); // {
    this.skipWhitespace();
    if (this.at() === "}") {
      this.advance();
      return;
    }
    for (;;) {
      this.skipWhitespace();
      const key = this.string();
      this.skipWhitespace();
      if (this.at() === ":") this.advance();
      this.value(`${pointer}/${escapePointerSegment(key)}`);
      this.skipWhitespace();
      if (this.at() === ",") {
        this.advance();
        continue;
      }
      if (this.at() === "}") this.advance();
      return;
    }
  }

  private array(pointer: string): void {
    this.advance(); // [
    this.skipWhitespace();
    if (this.at() === "]") {
      this.advance();
      return;
    }
    for (let i = 0; ; i++) {
      this.value(`${pointer}/${i}`);
      this.skipWhitespace();
      if (this.at() === ",") {
        this.advance();
        continue;
      }
      if (this.at() === "]") this.advance();
      return;
    }
  }

  /** Consumes a string literal and returns its decoded value. */
  private string(): string {
    if (this.at() !== '"') return "";
    this.advance();
    let out = "";
    while (this.at() !== "" && this.at() !== '"') {
      if (this.at() === "\\") {
        this.advance();
        const escape = this.at();
        if (escape === "u") {
          const hex = this.source.slice(this.cursor.index + 1, this.cursor.index + 5);
          out += String.fromCharCode(parseInt(hex, 16));
          this.advance(5);
          continue;
        }
        const simple: Record<string, string> = {
          '"': '"',
          "\\": "\\",
          "/": "/",
          b: "\b",
          f: "\f",
          n: "\n",
          r: "\r",
          t: "\t",
        };
        out += simple[escape] ?? escape;
        this.advance();
        continue;
      }
      out += this.at();
      this.advance();
    }
    this.advance(); // closing quote
    return out;
  }
}

/** Maps every JSON Pointer in the document to where its value starts. */
export function indexPositions(source: string): Map<string, SourcePosition> {
  return new Indexer(source).index();
}

/**
 * Position of one pointer, falling back to the nearest existing ancestor.
 *
 * The fallback is what makes "is missing required property" useful: the
 * pointer for a property that is not there cannot be in the index, but its
 * parent object is, and that is the place the user has to look.
 */
export function locatePointer(
  positions: Map<string, SourcePosition>,
  pointer: string,
): SourcePosition | null {
  let current = pointer;
  for (;;) {
    const found = positions.get(current);
    if (found) return found;
    if (current === "") return null;
    const cut = current.lastIndexOf("/");
    current = cut <= 0 ? "" : current.slice(0, cut);
  }
}

/** Line and column of a raw character offset — for JSON syntax errors. */
/** A window into the source, with the offending character marked. */
export interface Excerpt {
  /** The characters around the offset, with `…` where text was cut. */
  text: string;
  /** 0-based index of the offset within `text`, for a caret line under it. */
  caret: number;
}

/**
 * The characters either side of an offset, on one line.
 *
 * For the one failure that cannot be reformatted: a syntax error in a
 * minified document. There is no line to highlight — the line is the whole
 * file — so the only way to show the user where they are is to cut a window
 * out of it. Newlines and tabs become spaces so the caret below lines up.
 */
export function excerptAt(source: string, offset: number, radius = 48): Excerpt {
  const clamped = Math.max(0, Math.min(offset, source.length));
  const start = Math.max(0, clamped - radius);
  // `radius` characters on each side *of the marked one*, which is why the
  // end is inclusive of it.
  const end = Math.min(source.length, clamped + radius + 1);
  const lead = start > 0 ? "…" : "";
  const tail = end < source.length ? "…" : "";
  const slice = source.slice(start, end).replace(/[\n\r\t]/g, " ");
  return { text: `${lead}${slice}${tail}`, caret: lead.length + (clamped - start) };
}

export function positionOfOffset(source: string, offset: number): SourcePosition {
  const clamped = Math.max(0, Math.min(offset, source.length));
  const before = source.slice(0, clamped);
  const lastBreak = before.lastIndexOf("\n");
  return {
    offset: clamped,
    line: before.split("\n").length,
    column: clamped - lastBreak,
  };
}
