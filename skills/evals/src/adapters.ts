import { spawnSync } from "node:child_process";

import type { Run, Turn } from "./transcript.js";

/**
 * An adapter turns "run this prompt in this directory" into a normalized
 * {@link Run}. One per agent, because that is the only agent-specific code in
 * the evals — the cases and the assertions never learn which agent produced
 * the transcript.
 *
 * Pick one with OTE_EVAL_ADAPTER (default: claude-code).
 */
export interface Adapter {
  name: string;
  run: (input: { prompt: string; dir: string; maxTurns?: number }) => Run;
}

/**
 * Claude Code in headless mode. Chosen as the first adapter only because its
 * JSON event stream is documented and stable enough to normalize; nothing in
 * the eval design depends on it.
 *
 * The simulated organizer is not wired in here: a multi-turn conversation
 * needs the agent's session to be resumed with the persona's reply, which is
 * the one piece of plumbing that differs most between agents. See
 * `persona.ts` for the prompt and README.md § "The simulated organizer" for
 * what is left to build.
 */
export const claudeCode: Adapter = {
  name: "claude-code",
  run: ({ prompt, dir, maxTurns = 40 }) => {
    const result = spawnSync(
      "claude",
      ["-p", prompt, "--output-format", "stream-json", "--verbose", "--max-turns", String(maxTurns)],
      { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    if (result.error) throw result.error;
    return normalizeClaudeStream(result.stdout, dir);
  },
};

/** Exported for its own tests: parsing a transcript must not need a subprocess. */
/**
 * The slice of the agent's event stream these evals read. Deliberately narrow:
 * an adapter that models the whole protocol is an adapter that breaks whenever
 * the protocol grows a field.
 */
interface ToolInput {
  command?: unknown;
  file_path?: unknown;
  url?: unknown;
  skill?: unknown;
}

interface ContentBlock {
  type?: string;
  text?: string;
  name?: string;
  input?: ToolInput;
  content?: string | { text?: string }[];
}

interface StreamEvent {
  type?: string;
  message?: { content?: ContentBlock[] | string };
}

export function normalizeClaudeStream(stdout: string, dir: string): Run {
  const turns: Turn[] = [];
  const skillsLoaded: string[] = [];

  for (const line of stdout.split("\n")) {
    if (!line.trim()) continue;
    let event: StreamEvent;
    try {
      event = JSON.parse(line);
    } catch {
      continue; // a partial line; the stream is append-only, so skipping is safe
    }

    const content = event?.message?.content;
    const blocks: ContentBlock[] = Array.isArray(content) ? content : [];
    for (const block of blocks) {
      if (block.type === "text" && event.type === "assistant") {
        turns.push({ role: "assistant", text: block.text });
      }
      if (block.type === "tool_use") {
        const normalized = normalizeToolUse(block.name ?? "", block.input ?? {});
        if (normalized) turns.push({ role: "tool", tool: normalized });
        if (block.name === "Skill" && typeof block.input?.skill === "string") {
          skillsLoaded.push(block.input.skill);
        }
      }
      if (block.type === "tool_result") {
        const text = Array.isArray(block.content)
          ? block.content.map((c) => c.text ?? "").join("\n")
          : String(block.content ?? "");
        const last = turns[turns.length - 1];
        if (last?.role === "tool") last.output = text;
      }
    }
    if (event.type === "user" && typeof event.message?.content === "string") {
      turns.push({ role: "user", text: event.message.content });
    }
  }

  return { skillsLoaded, turns, dir };
}

function normalizeToolUse(name: string, input: ToolInput) {
  const relative = (p: unknown) =>
    typeof p === "string" ? p.replace(/^.*?\/(?=events\/|src\/|README)/, "") : undefined;
  switch (name) {
    case "Bash":
      return { name: "bash", command: String(input.command ?? "") };
    case "Write":
      return { name: "write", path: relative(input.file_path) };
    case "Edit":
    case "NotebookEdit":
      return { name: "edit", path: relative(input.file_path) };
    case "Read":
      return { name: "read", path: relative(input.file_path) };
    case "WebFetch":
      return { name: "fetch", command: String(input.url ?? "") };
    default:
      return undefined;
  }
}

export const adapters: Record<string, Adapter> = { "claude-code": claudeCode };

export const pickAdapter = (name = process.env.OTE_EVAL_ADAPTER ?? "claude-code"): Adapter => {
  const adapter = adapters[name];
  if (!adapter) {
    throw new Error(
      `unknown adapter "${name}". Available: ${Object.keys(adapters).join(", ")}. ` +
        "Adding one means normalizing that agent's transcript into src/transcript.ts's shape — nothing else.",
    );
  }
  return adapter;
};
