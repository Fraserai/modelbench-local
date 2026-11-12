export type ProviderId = "openai" | "anthropic" | "google" | "xai" | "local";

export type PromptModeId =
  | "creative-writer"
  | "business-analyst"
  | "sales-copywriter"
  | "software-engineer"
  | "agent-planner"
  | "critical-reviewer";

export type ScoreKey =
  | "clarity"
  | "usefulness"
  | "specificity"
  | "creativity"
  | "businessValue";

export type Scorecard = Record<ScoreKey, number>;

export interface ModelProvider {
  id: ProviderId;
  label: string;
  status: "placeholder" | "simulated";
  description: string;
}

export interface PromptMode {
  id: PromptModeId;
  name: string;
  role: string;
  provider: ProviderId;
  modelName: string;
  accent: string;
  summary: string;
  scoreBias: Partial<Scorecard>;
}

export interface OutputMetadata {
  adapterId: string;
  latencyMs: number;
  rubricVersion: string;
}

export interface TokenCostEstimate {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: "USD";
}

export interface ExperimentOutput {
  id: string;
  modeId: PromptModeId;
  modeName: string;
  provider: ProviderId;
  providerLabel: string;
  modelName: string;
  output: string;
  scorecard: Scorecard;
  tokenEstimate: TokenCostEstimate;
  generatedAt: string;
  status: "success" | "error";
  metadata: OutputMetadata;
  errorMessage?: string;
}

export interface ExperimentRecord {
  id: string;
  schemaVersion: number;
  title: string;
  prompt: string;
  modeIds: PromptModeId[];
  outputs: ExperimentOutput[];
  createdAt: string;
}

export interface PromptLibraryItem {
  id: string;
  title: string;
  category: string;
  prompt: string;
  suggestedModes: PromptModeId[];
}
