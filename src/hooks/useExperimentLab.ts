"use client";

import { useCallback, useMemo, useState } from "react";
import { averageScore } from "@/lib/evals/score";
import { runExperiment as runExperimentEngine } from "@/lib/models/experiment-engine";
import { promptLibrary } from "@/lib/prompts/library";
import { estimateTokens } from "@/lib/token-costs/estimate";
import { useLocalExperimentHistory } from "@/hooks/useLocalExperimentHistory";
import type {
  ExperimentRecord,
  PromptLibraryItem,
  PromptModeId,
} from "@/types";

const defaultPrompt = promptLibrary[2].prompt;
const defaultModes: PromptModeId[] = [
  "business-analyst",
  "software-engineer",
  "critical-reviewer",
];

export function useExperimentLab() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [selectedModeIds, setSelectedModeIds] =
    useState<PromptModeId[]>(defaultModes);
  const [outputs, setOutputs] = useState<ExperimentRecord["outputs"]>([]);
  const [activeExperimentId, setActiveExperimentId] = useState<string | null>(
    null,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const { history, addRecord, clearHistory } = useLocalExperimentHistory();

  const runSummary = useMemo(() => {
    const totalCost = outputs.reduce(
      (sum, output) => sum + output.tokenEstimate.totalCost,
      0,
    );
    const score =
      outputs.length > 0
        ? Math.round(
            outputs.reduce(
              (sum, output) => sum + averageScore(output.scorecard),
              0,
            ) / outputs.length,
          )
        : 0;

    return {
      totalCost,
      score,
      inputTokens: estimateTokens(prompt),
    };
  }, [outputs, prompt]);

  const toggleMode = useCallback((modeId: PromptModeId) => {
    setSelectedModeIds((current) => {
      if (current.includes(modeId)) {
        return current.filter((id) => id !== modeId);
      }

      return [...current, modeId];
    });
  }, []);

  const runExperiment = useCallback(async () => {
    if (!prompt.trim() || selectedModeIds.length === 0 || isRunning) {
      return;
    }

    setIsRunning(true);
    setRunError(null);

    try {
      const record = await runExperimentEngine({
        prompt,
        modeIds: selectedModeIds,
        requestedAt: new Date().toISOString(),
      });

      setOutputs(record.outputs);
      setActiveExperimentId(record.id);
      addRecord(record);
    } catch (error) {
      setRunError(
        error instanceof Error ? error.message : "Experiment run failed",
      );
    } finally {
      setIsRunning(false);
    }
  }, [addRecord, isRunning, prompt, selectedModeIds]);

  const selectPrompt = useCallback((item: PromptLibraryItem) => {
    setPrompt(item.prompt);
    setSelectedModeIds(item.suggestedModes);
    setRunError(null);
  }, []);

  const selectExperiment = useCallback((record: ExperimentRecord) => {
    setPrompt(record.prompt);
    setSelectedModeIds(record.modeIds);
    setOutputs(record.outputs);
    setActiveExperimentId(record.id);
    setRunError(null);
  }, []);

  const resetPrompt = useCallback(() => {
    setPrompt("");
    setOutputs([]);
    setActiveExperimentId(null);
    setRunError(null);
  }, []);

  const clearExperimentHistory = useCallback(() => {
    clearHistory();
    setActiveExperimentId(null);
  }, [clearHistory]);

  return {
    prompt,
    setPrompt,
    selectedModeIds,
    outputs,
    history,
    activeExperimentId,
    isRunning,
    runError,
    runSummary,
    toggleMode,
    runExperiment,
    selectPrompt,
    selectExperiment,
    resetPrompt,
    clearExperimentHistory,
  };
}
