import type { PromptMode, ScoreKey, Scorecard } from "@/types";

export const scoreLabels: Record<ScoreKey, string> = {
  clarity: "Clarity",
  usefulness: "Usefulness",
  specificity: "Specificity",
  creativity: "Creativity",
  businessValue: "Business value",
};

const scoreKeys: ScoreKey[] = [
  "clarity",
  "usefulness",
  "specificity",
  "creativity",
  "businessValue",
];

function clampScore(value: number) {
  return Math.max(58, Math.min(98, Math.round(value)));
}

function signalScore(prompt: string, output: string) {
  const promptWords = prompt.trim().split(/\s+/).filter(Boolean).length;
  const outputWords = output.trim().split(/\s+/).filter(Boolean).length;
  const structureSignals =
    (output.match(/\n-/g)?.length ?? 0) +
    (output.match(/\n[0-9]\./g)?.length ?? 0);

  return {
    promptDepth: Math.min(12, promptWords / 4),
    outputDepth: Math.min(14, outputWords / 18),
    structure: Math.min(10, structureSignals * 1.4),
  };
}

export function scoreOutput(
  prompt: string,
  output: string,
  mode: PromptMode,
): Scorecard {
  const signals = signalScore(prompt, output);
  const base: Record<ScoreKey, number> = {
    clarity: 72 + signals.structure + signals.promptDepth * 0.4,
    usefulness: 70 + signals.outputDepth + signals.promptDepth * 0.5,
    specificity: 68 + signals.structure * 0.7 + signals.promptDepth,
    creativity: 66 + signals.outputDepth * 0.5,
    businessValue: 64 + signals.promptDepth * 0.8 + signals.structure * 0.3,
  };

  return scoreKeys.reduce((scorecard, key) => {
    scorecard[key] = clampScore(base[key] + (mode.scoreBias[key] ?? 0));
    return scorecard;
  }, {} as Scorecard);
}

export function averageScore(scorecard: Scorecard) {
  const total = scoreKeys.reduce((sum, key) => sum + scorecard[key], 0);
  return Math.round(total / scoreKeys.length);
}
