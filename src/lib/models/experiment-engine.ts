import { scoreOutput } from "@/lib/evals/score";
import {
  experimentSchemaVersion,
  titleFromPrompt,
} from "@/lib/models/experiments";
import { modeById } from "@/lib/models/modes";
import { providers } from "@/lib/models/providers";
import { getProviderAdapter } from "@/lib/models/adapters/registry";
import { estimateTokenCost } from "@/lib/token-costs/estimate";
import type {
  ExperimentOutput,
  ExperimentRecord,
  PromptMode,
  PromptModeId,
} from "@/types";

interface RunExperimentInput {
  prompt: string;
  modeIds: PromptModeId[];
  requestedAt: string;
}

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function runMode(
  request: RunExperimentInput,
  mode: PromptMode,
): Promise<ExperimentOutput> {
  const provider = providers[mode.provider];

  try {
    const adapter = getProviderAdapter(mode.provider);
    const adapterResult = await adapter.run({
      prompt: request.prompt,
      mode,
    });
    const scorecard = scoreOutput(request.prompt, adapterResult.content, mode);

    return {
      id: createId("output"),
      modeId: mode.id,
      modeName: mode.name,
      provider: mode.provider,
      providerLabel: provider.label,
      modelName: adapterResult.modelName,
      output: adapterResult.content,
      scorecard,
      tokenEstimate: estimateTokenCost(
        request.prompt,
        adapterResult.content,
        mode.provider,
      ),
      generatedAt: new Date().toISOString(),
      status: "success",
      metadata: {
        adapterId: adapter.id,
        latencyMs: adapterResult.latencyMs,
        rubricVersion: "heuristic-v1",
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown provider error";
    const output = `Provider run failed: ${errorMessage}`;

    return {
      id: createId("output"),
      modeId: mode.id,
      modeName: mode.name,
      provider: mode.provider,
      providerLabel: provider.label,
      modelName: mode.modelName,
      output,
      scorecard: scoreOutput(request.prompt, output, mode),
      tokenEstimate: estimateTokenCost(request.prompt, output, mode.provider),
      generatedAt: new Date().toISOString(),
      status: "error",
      metadata: {
        adapterId: "unavailable",
        latencyMs: 0,
        rubricVersion: "heuristic-v1",
      },
      errorMessage,
    };
  }
}

export async function runExperiment(
  request: RunExperimentInput,
): Promise<ExperimentRecord> {
  const outputs = await Promise.all(
    request.modeIds.map((modeId) => runMode(request, modeById[modeId])),
  );

  return {
    id: createId("experiment"),
    schemaVersion: experimentSchemaVersion,
    title: titleFromPrompt(request.prompt),
    prompt: request.prompt,
    modeIds: request.modeIds,
    outputs,
    createdAt: request.requestedAt,
  };
}
