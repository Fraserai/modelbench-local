"use client";

import { RotateCcw, TerminalSquare } from "lucide-react";
import { ModeSelector } from "@/components/lab/ModeSelector";
import { RunButton } from "@/components/lab/RunButton";
import type { PromptModeId } from "@/types";

interface PromptInputPanelProps {
  prompt: string;
  selectedModeIds: PromptModeId[];
  isRunning: boolean;
  onPromptChange: (prompt: string) => void;
  onToggleMode: (modeId: PromptModeId) => void;
  onRun: () => void;
  onReset: () => void;
}

export function PromptInputPanel({
  prompt,
  selectedModeIds,
  isRunning,
  onPromptChange,
  onToggleMode,
  onRun,
  onReset,
}: PromptInputPanelProps) {
  const canRun = prompt.trim().length > 0 && selectedModeIds.length > 0;
  const readinessText = !prompt.trim()
    ? "Add a prompt to start."
    : selectedModeIds.length === 0
      ? "Select at least one mode."
      : "Ready to run locally.";

  return (
    <section
      id="prompt"
      className="ai-surface rounded-lg p-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-cyan-300/10 text-cyan-200">
              <TerminalSquare className="h-4 w-4" />
            </span>
            Command center
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            ModelBench
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-bench-muted">
            Stress-test a prompt across expert perspectives and turn the best
            output into your next decision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-bench-muted">
          <span className="ai-chip rounded-md px-2.5 py-1">
            {prompt.length.toLocaleString()} chars
          </span>
          <span className="ai-chip rounded-md px-2.5 py-1">
            {selectedModeIds.length} selected
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="ai-surface-soft flex min-h-[340px] flex-col rounded-lg">
          <label
            htmlFor="prompt-input"
            className="border-b border-white/10 px-3 py-2 text-xs font-semibold text-bench-muted"
          >
            Task prompt
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe the decision, feature, customer scenario, or prompt you want to compare..."
            className="scrollbar-thin min-h-[254px] flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:bg-white/[0.02]"
          />
          <div className="flex flex-col gap-3 border-t border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-bench-muted transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <p className="text-xs font-medium text-bench-muted sm:mr-auto">
              {readinessText}
            </p>
            <RunButton disabled={!canRun} isRunning={isRunning} onRun={onRun} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Expert modes</h2>
            <span className="ai-chip rounded-md px-2 py-1 text-xs text-bench-muted">
              Choose 2-4
            </span>
          </div>
          <ModeSelector
            selectedModeIds={selectedModeIds}
            onToggleMode={onToggleMode}
          />
        </div>
      </div>
    </section>
  );
}
