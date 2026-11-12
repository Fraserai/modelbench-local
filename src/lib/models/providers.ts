import type { ModelProvider, ProviderId } from "@/types";

export const providers: Record<ProviderId, ModelProvider> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    status: "placeholder",
    description: "Provider placeholder for future Responses API integration.",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    status: "placeholder",
    description: "Provider placeholder for future Claude integration.",
  },
  google: {
    id: "google",
    label: "Google Gemini",
    status: "placeholder",
    description: "Provider placeholder for future Gemini integration.",
  },
  xai: {
    id: "xai",
    label: "xAI",
    status: "placeholder",
    description: "Provider placeholder for future Grok integration.",
  },
  local: {
    id: "local",
    label: "Local Sim",
    status: "simulated",
    description: "Local deterministic simulation used by the MVP.",
  },
};

export const providerList = Object.values(providers);
