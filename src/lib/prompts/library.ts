import type { PromptLibraryItem } from "@/types";

export const promptLibrary: PromptLibraryItem[] = [
  {
    id: "launch-plan",
    title: "Launch plan",
    category: "Go-to-market",
    prompt:
      "Design a launch plan for a privacy-first note-taking app aimed at independent consultants. Include positioning, launch channels, risks, and a 30-day action plan.",
    suggestedModes: ["business-analyst", "sales-copywriter", "critical-reviewer"],
  },
  {
    id: "agent-workflow",
    title: "Research agent",
    category: "Agent design",
    prompt:
      "Create an agent workflow that researches competitor pricing, extracts key claims, summarizes gaps, and prepares a weekly decision brief for a product team.",
    suggestedModes: ["agent-planner", "software-engineer", "critical-reviewer"],
  },
  {
    id: "feature-spec",
    title: "Feature spec",
    category: "Product",
    prompt:
      "Draft a feature spec for a dashboard that compares AI model outputs, lets users score responses, and saves experiment history locally before backend accounts exist.",
    suggestedModes: ["software-engineer", "business-analyst", "agent-planner"],
  },
  {
    id: "brand-story",
    title: "Brand story",
    category: "Messaging",
    prompt:
      "Write a premium brand story for a local AI lab tool used by founders and engineers who want to understand how different prompt styles change model behavior.",
    suggestedModes: ["creative-writer", "sales-copywriter", "critical-reviewer"],
  },
];
