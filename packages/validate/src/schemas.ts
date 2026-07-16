import { readFileSync } from "node:fs";

import type { AnySchemaObject } from "ajv";

const schemasDir = new URL("../schemas/", import.meta.url);

function loadSchema(filename: string): AnySchemaObject {
  return JSON.parse(
    readFileSync(new URL(filename, schemasDir), "utf8"),
  ) as AnySchemaObject;
}

/** OTE v0.2 JSON Schema for Event documents (vendored, see schemas/README.md). */
export const eventSchema = loadSchema("event.schema.json");

/** OTE v0.2 JSON Schema for Feed documents (vendored, see schemas/README.md). */
export const feedSchema = loadSchema("feed.schema.json");
