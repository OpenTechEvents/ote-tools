/**
 * The normalized transcript every assertion reads.
 *
 * Agents report runs in wildly different shapes (Claude Code's stream-json,
 * Copilot's logs, Codex's output). Normalizing once, in an adapter, is what
 * keeps the assertions agent-agnostic and — more importantly — unit-testable
 * without an agent or an API key: every test in `test/` builds these objects
 * by hand.
 */

export interface ToolCall {
  /** Adapter-normalized tool name: "bash", "write", "edit", "read", "fetch". */
  name: string;
  /** For "bash": the command line, verbatim. */
  command?: string;
  /** For file tools: the path touched, relative to the run directory. */
  path?: string;
}

export interface Turn {
  role: "user" | "assistant" | "tool";
  /** Prose the agent or the simulated organizer produced. */
  text?: string;
  /** Present on `role: "tool"` turns. */
  tool?: ToolCall;
  /** stdout/stderr of the tool, when the adapter captured it. */
  output?: string;
}

export interface Run {
  /** Which skills the agent reported loading, if it reports that at all. */
  skillsLoaded: string[];
  turns: Turn[];
  /** Absolute path of the throwaway directory the run happened in. */
  dir: string;
}

export const toolTurns = (run: Run): Turn[] => run.turns.filter((t) => t.role === "tool");

export const bashCommands = (run: Run): string[] =>
  toolTurns(run)
    .filter((t) => t.tool?.name === "bash" && t.tool.command)
    .map((t) => t.tool!.command!);

export const writeTurns = (run: Run): Turn[] =>
  toolTurns(run).filter((t) => t.tool?.name === "write" || t.tool?.name === "edit");

/** Assistant prose that asks the organizer something, in order. */
export const questionTurns = (run: Run): Turn[] =>
  run.turns.filter((t) => t.role === "assistant" && !!t.text?.includes("?"));
