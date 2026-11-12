import { localSimulationAdapter } from "@/lib/models/adapters/local-simulation";
import type { AIProviderAdapter } from "@/lib/models/adapters/types";
import type { ProviderId } from "@/types";

const providerAdapters: Partial<Record<ProviderId, AIProviderAdapter>> = {
  local: localSimulationAdapter,
};

export function getProviderAdapter(provider: ProviderId) {
  return providerAdapters[provider] ?? localSimulationAdapter;
}
