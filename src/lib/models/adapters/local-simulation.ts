import type { AIProviderAdapter } from "@/lib/models/adapters/types";
import type { PromptModeId } from "@/types";

function promptFocus(prompt: string) {
  const words = prompt
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 12);

  return words.length > 0 ? words.join(" ") : "the requested task";
}

function creativeWriter(prompt: string) {
  const focus = promptFocus(prompt);
  return `Core concept: Treat ${focus} as a story with a visible transformation.

- Opening hook: Start with the moment the user realizes the old way is too slow, vague, or expensive.
- Voice: Confident, cinematic, and precise rather than whimsical.
- Structure: Problem tension, surprising shift, concrete proof, memorable closing line.
- Best line to test: "The workbench does not guess what good looks like. It lets you compare, score, and learn it."`;
}

function businessAnalyst(prompt: string) {
  const focus = promptFocus(prompt);
  return `Business readout for ${focus}:

1. Primary audience: Operators who need repeatable evidence before committing to a model or prompt strategy.
2. Value driver: Faster comparison cycles, clearer quality criteria, and lower spend on failed prompt trials.
3. Success metrics: Experiment completion rate, average score lift, saved prompt reuse, and cost per useful output.
4. Risks: Scores can look authoritative before they are calibrated; history needs exportability once teams adopt it.
5. Next decision: Validate whether users care more about provider comparison, prompt iteration, or evaluation rigor.`;
}

function salesCopywriter(prompt: string) {
  const focus = promptFocus(prompt);
  return `Conversion angle for ${focus}:

- Headline: Compare AI answers before you trust them.
- Subhead: Run one prompt through multiple expert modes, score the outputs, and see cost estimates without wiring an API key.
- Proof point: Local history makes every experiment reusable, not just another lost chat.
- CTA: Run the benchmark.
- Objection handler: This starts simulated on purpose, so teams can shape the workflow before provider costs enter the loop.`;
}

function softwareEngineer(prompt: string) {
  const focus = promptFocus(prompt);
  return `Implementation plan for ${focus}:

- Domain model: Provider, prompt mode, experiment, output, scorecard, and token estimate.
- UI state: Keep prompt, selected modes, current results, and browser history in isolated client state.
- Provider seam: Route all future API calls through provider adapters that return a normalized ExperimentOutput.
- Evaluation seam: Keep score generation separate from rendering so rubric changes do not touch UI components.
- Test surface: Unit test scoring and token estimates first, then add browser tests around experiment creation and history restore.`;
}

function agentPlanner(prompt: string) {
  const focus = promptFocus(prompt);
  return `Agent workflow for ${focus}:

Goal: Produce comparable outputs with a traceable evaluation loop.

- Planner: Parse the task, choose candidate modes, and define scoring priorities.
- Executor: Run each selected provider adapter with shared prompt context.
- Evaluator: Score clarity, usefulness, specificity, creativity, and business value.
- Memory: Persist experiment metadata, prompt variants, model settings, and user notes.
- Checkpoint: Ask for human review when score variance is high or costs exceed the run budget.`;
}

function criticalReviewer(prompt: string) {
  const focus = promptFocus(prompt);
  return `Critical review of ${focus}:

- Hidden assumption: The selected modes may be more important than the underlying model choice.
- Quality risk: A single numeric score can hide why an output is weak.
- Product risk: Local history is useful, but teams will eventually need import, export, and shared evaluation rubrics.
- Evaluation gap: Add side-by-side notes and a final preference vote before treating scores as decisions.
- Strong next move: Make calibration visible by showing why each score changed between runs.`;
}

const generators: Record<PromptModeId, (prompt: string) => string> = {
  "creative-writer": creativeWriter,
  "business-analyst": businessAnalyst,
  "sales-copywriter": salesCopywriter,
  "software-engineer": softwareEngineer,
  "agent-planner": agentPlanner,
  "critical-reviewer": criticalReviewer,
};

export const localSimulationAdapter: AIProviderAdapter = {
  id: "local-simulation",
  async run({ prompt, mode }) {
    const startedAt = Date.now();
    const content = generators[mode.id](prompt);
    const deterministicDelay = 120 + mode.name.length * 11;

    return {
      content,
      modelName: mode.modelName,
      latencyMs: Date.now() - startedAt + deterministicDelay,
    };
  },
};
