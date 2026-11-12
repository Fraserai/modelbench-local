import type { ProviderId, TokenCostEstimate } from "@/types";

const simulatedPricingPerThousand: Record<
  ProviderId,
  { input: number; output: number }
> = {
  openai: { input: 0.003, output: 0.012 },
  anthropic: { input: 0.004, output: 0.015 },
  google: { input: 0.002, output: 0.008 },
  xai: { input: 0.0025, output: 0.01 },
  local: { input: 0, output: 0 },
};

export function estimateTokens(text: string) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return 0;
  }

  const characterEstimate = Math.ceil(normalized.length / 4);
  const wordEstimate = Math.ceil(normalized.split(" ").length * 1.25);

  return Math.max(characterEstimate, wordEstimate);
}

export function estimateTokenCost(
  prompt: string,
  output: string,
  provider: ProviderId,
): TokenCostEstimate {
  const inputTokens = estimateTokens(prompt);
  const outputTokens = estimateTokens(output);
  const pricing = simulatedPricingPerThousand[provider];
  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = (outputTokens / 1000) * pricing.output;

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    currency: "USD",
  };
}

export function formatCost(value: number) {
  if (value === 0) {
    return "$0.0000";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}
