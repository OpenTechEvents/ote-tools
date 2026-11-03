import { describe, expect, it } from "vitest";

import { normalizeClaudeStream, pickAdapter } from "../src/adapters.js";

const line = (event: unknown) => JSON.stringify(event) + "\n";

describe("normalizeClaudeStream", () => {
  it("normalizes prose, tool calls, tool output and the skills it loaded", () => {
    const stdout =
      line({
        type: "assistant",
        message: { content: [{ type: "tool_use", name: "Skill", input: { skill: "ote-event" } }] },
      }) +
      line({ type: "assistant", message: { content: [{ type: "text", text: "Two things the page could not say?" }] } }) +
      line({
        type: "assistant",
        message: { content: [{ type: "tool_use", name: "Bash", input: { command: "ote-validate events/x.json" } }] },
      }) +
      line({ type: "user", message: { content: [{ type: "tool_result", content: [{ text: "1/1 valid" }] }] } }) +
      line({
        type: "assistant",
        message: { content: [{ type: "tool_use", name: "Write", input: { file_path: "/tmp/ote-eval-x/events/x.json" } }] },
      });

    const run = normalizeClaudeStream(stdout, "/tmp/ote-eval-x");

    expect(run.skillsLoaded).toEqual(["ote-event"]);
    // Loading a skill is not a tool turn: it is reported in skillsLoaded, and
    // keeping it out of the transcript stops it counting towards anything.
    expect(run.turns.map((t) => t.role)).toEqual(["assistant", "tool", "tool"]);
    expect(run.turns[1].tool).toEqual({ name: "bash", command: "ote-validate events/x.json" });
    expect(run.turns[1].output).toBe("1/1 valid");
    expect(run.turns[2].tool).toEqual({ name: "write", path: "events/x.json" });
  });

  it("skips partial lines instead of throwing — the stream is append-only", () => {
    const run = normalizeClaudeStream('{"type":"assistant","mess', "/tmp/x");
    expect(run.turns).toEqual([]);
  });

  it("names the available adapters when asked for one that does not exist", () => {
    expect(() => pickAdapter("copilot")).toThrow(/claude-code/);
  });
});
