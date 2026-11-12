"use client";

import { useCallback, useEffect, useState } from "react";
import { scoreOutput } from "@/lib/evals/score";
import { modeById, promptModes } from "@/lib/models/modes";
import { providers } from "@/lib/models/providers";
import {
  experimentSchemaVersion,
  titleFromPrompt,
} from "@/lib/models/experiments";
import { estimateTokenCost } from "@/lib/token-costs/estimate";
import type {
  ExperimentOutput,
  ExperimentRecord,
  PromptModeId,
  ProviderId,
  ScoreKey,
  Scorecard,
} from "@/types";

const historyKey = "modelbench.experimentHistory.v1";
const historyLimit = 14;
const scoreKeys: ScoreKey[] = [
  "clarity",
  "usefulness",
  "specificity",
  "creativity",
  "businessValue",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPromptModeId(value: unknown): value is PromptModeId {
  return (
    typeof value === "string" &&
    promptModes.some((mode) => mode.id === value)
  );
}

function isProviderId(value: unknown): value is ProviderId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(providers, value)
  );
}

function normalizeScorecard(
  value: unknown,
  prompt: string,
  output: string,
  modeId: PromptModeId,
): Scorecard {
  if (isObject(value)) {
    const candidate = scoreKeys.reduce((scorecard, key) => {
      const score = value[key];
      scorecard[key] = typeof score === "number" ? score : 0;
      return scorecard;
    }, {} as Scorecard);

    if (scoreKeys.every((key) => candidate[key] > 0)) {
      return candidate;
    }
  }

  return scoreOutput(prompt, output, modeById[modeId]);
}

function normalizeOutput(
  value: unknown,
  prompt: string,
): ExperimentOutput | null {
  if (!isObject(value) || !isPromptModeId(value.modeId)) {
    return null;
  }

  const mode = modeById[value.modeId];
  const output = typeof value.output === "string" ? value.output : "";
  const provider = isProviderId(value.provider) ? value.provider : mode.provider;
  const providerLabel =
    typeof value.providerLabel === "string"
      ? value.providerLabel
      : providers[provider].label;
  const generatedAt =
    typeof value.generatedAt === "string"
      ? value.generatedAt
      : new Date().toISOString();
  const metadata = isObject(value.metadata) ? value.metadata : {};
  const latencyMs =
    typeof metadata.latencyMs === "number" ? metadata.latencyMs : 0;
  const adapterId =
    typeof metadata.adapterId === "string" ? metadata.adapterId : "legacy";
  const rubricVersion =
    typeof metadata.rubricVersion === "string"
      ? metadata.rubricVersion
      : "heuristic-v1";

  return {
    id: typeof value.id === "string" ? value.id : `legacy-${generatedAt}`,
    modeId: value.modeId,
    modeName: typeof value.modeName === "string" ? value.modeName : mode.name,
    provider,
    providerLabel,
    modelName:
      typeof value.modelName === "string" ? value.modelName : mode.modelName,
    output,
    scorecard: normalizeScorecard(value.scorecard, prompt, output, value.modeId),
    tokenEstimate: estimateTokenCost(prompt, output, provider),
    generatedAt,
    status: value.status === "error" ? "error" : "success",
    metadata: {
      adapterId,
      latencyMs,
      rubricVersion,
    },
    errorMessage:
      typeof value.errorMessage === "string" ? value.errorMessage : undefined,
  };
}

function normalizeRecord(value: unknown): ExperimentRecord | null {
  if (!isObject(value) || typeof value.prompt !== "string") {
    return null;
  }

  const modeIds = Array.isArray(value.modeIds)
    ? value.modeIds.filter(isPromptModeId)
    : [];
  const outputs = Array.isArray(value.outputs)
    ? value.outputs.flatMap((output) => {
        const normalized = normalizeOutput(output, value.prompt as string);
        return normalized ? [normalized] : [];
      })
    : [];
  const createdAt =
    typeof value.createdAt === "string"
      ? value.createdAt
      : new Date().toISOString();

  return {
    id: typeof value.id === "string" ? value.id : `legacy-${createdAt}`,
    schemaVersion:
      typeof value.schemaVersion === "number"
        ? value.schemaVersion
        : experimentSchemaVersion,
    title:
      typeof value.title === "string"
        ? value.title
        : titleFromPrompt(value.prompt),
    prompt: value.prompt,
    modeIds,
    outputs,
    createdAt,
  };
}

function readHistory() {
  try {
    const saved = window.localStorage.getItem(historyKey);
    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .flatMap((record) => {
        const normalized = normalizeRecord(record);
        return normalized ? [normalized] : [];
      })
      .slice(0, historyLimit);
  } catch {
    return [];
  }
}

export function useLocalExperimentHistory() {
  const [history, setHistory] = useState<ExperimentRecord[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    setHistory(readHistory());
    setHistoryLoaded(true);
  }, []);

  useEffect(() => {
    if (!historyLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(historyKey, JSON.stringify(history));
    } catch {
      // Keep the lab usable even when storage is unavailable or full.
    }
  }, [history, historyLoaded]);

  const addRecord = useCallback((record: ExperimentRecord) => {
    setHistory((current) => [record, ...current].slice(0, historyLimit));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addRecord,
    clearHistory,
    historyLoaded,
  };
}
