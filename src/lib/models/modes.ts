import type { PromptMode, PromptModeId } from "@/types";

export const promptModes: PromptMode[] = [
  {
    id: "creative-writer",
    name: "Creative Writer",
    role: "Narrative ideation",
    provider: "openai",
    modelName: "gpt-lab-creative-sim",
    accent: "#9b8cff",
    summary: "Turns the prompt into evocative structure, hooks, and voice options.",
    scoreBias: { creativity: 14, clarity: 4 },
  },
  {
    id: "business-analyst",
    name: "Business Analyst",
    role: "Market logic",
    provider: "anthropic",
    modelName: "claude-lab-analyst-sim",
    accent: "#38bdf8",
    summary: "Frames tradeoffs, segments, metrics, and decision paths.",
    scoreBias: { usefulness: 12, businessValue: 15, specificity: 7 },
  },
  {
    id: "sales-copywriter",
    name: "Sales Copywriter",
    role: "Conversion copy",
    provider: "xai",
    modelName: "grok-lab-copy-sim",
    accent: "#f59e0b",
    summary: "Builds persuasive positioning, angles, and calls to action.",
    scoreBias: { creativity: 9, businessValue: 12, clarity: 7 },
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    role: "Implementation planning",
    provider: "openai",
    modelName: "gpt-lab-engineer-sim",
    accent: "#22c55e",
    summary: "Breaks work into architecture, interfaces, risks, and tests.",
    scoreBias: { specificity: 14, usefulness: 10, clarity: 7 },
  },
  {
    id: "agent-planner",
    name: "Agent Planner",
    role: "Workflow design",
    provider: "google",
    modelName: "gemini-lab-agent-sim",
    accent: "#2dd4bf",
    summary: "Converts the prompt into goals, tools, memory, and checkpoints.",
    scoreBias: { usefulness: 11, specificity: 10, businessValue: 5 },
  },
  {
    id: "critical-reviewer",
    name: "Critical Reviewer",
    role: "Risk analysis",
    provider: "local",
    modelName: "local-eval-reviewer-sim",
    accent: "#fb7185",
    summary: "Stress tests assumptions, missing evidence, and failure modes.",
    scoreBias: { clarity: 8, usefulness: 10, specificity: 11 },
  },
];

export const modeById = promptModes.reduce(
  (acc, mode) => {
    acc[mode.id] = mode;
    return acc;
  },
  {} as Record<PromptModeId, PromptMode>,
);
