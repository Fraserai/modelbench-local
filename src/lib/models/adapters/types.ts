import type { PromptMode } from "@/types";

export interface AdapterRunInput {
  prompt: string;
  mode: PromptMode;
}

export interface AdapterRunResult {
  content: string;
  modelName: string;
  latencyMs: number;
}

export interface AIProviderAdapter {
  id: string;
  run(input: AdapterRunInput): Promise<AdapterRunResult>;
}
