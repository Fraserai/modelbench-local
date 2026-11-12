"use client";

import { Clock3, Trash2 } from "lucide-react";
import { averageScore } from "@/lib/evals/score";
import { formatCost } from "@/lib/token-costs/estimate";
import type { ExperimentRecord } from "@/types";

interface ExperimentHistoryPanelProps {
  history: ExperimentRecord[];
  activeExperimentId: string | null;
  onSelectExperiment: (record: ExperimentRecord) => void;
  onClearHistory: () => void;
}

function experimentAverage(record: ExperimentRecord) {
  if (record.outputs.length === 0) {
    return 0;
  }

  const total = record.outputs.reduce(
    (sum, output) => sum + averageScore(output.scorecard),
    0,
  );
  return Math.round(total / record.outputs.length);
}

function experimentCost(record: ExperimentRecord) {
  return record.outputs.reduce(
    (sum, output) => sum + output.tokenEstimate.totalCost,
    0,
  );
}

export function ExperimentHistoryPanel({
  history,
  activeExperimentId,
  onSelectExperiment,
  onClearHistory,
}: ExperimentHistoryPanelProps) {
  return (
    <section
      id="history"
      className="ai-surface rounded-lg"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-fuchsia-300/10 text-fuchsia-100">
              <Clock3 className="h-4 w-4" />
            </span>
            Run history
          </div>
          <p className="mt-1 text-xs text-bench-muted">Saved on this device</p>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          disabled={history.length === 0}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-bench-muted transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Clear history"
          title="Clear history"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[420px] overflow-auto">
        {history.length > 0 ? (
          <div className="divide-y divide-white/10">
            {history.map((record) => {
              const active = activeExperimentId === record.id;
              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onSelectExperiment(record)}
                  className="w-full p-4 text-left transition hover:bg-white/[0.06]"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.06)" : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {record.title}
                      </div>
                      <div className="mt-1 text-xs text-bench-muted">
                        {new Date(record.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <span className="rounded-md border border-teal-300/20 bg-teal-400/10 px-2 py-1 text-xs font-semibold text-teal-100">
                      {experimentAverage(record)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-bench-muted">
                    <span className="ai-chip rounded-md px-2 py-1">
                      {record.outputs.length} outputs
                    </span>
                    <span className="ai-chip rounded-md px-2 py-1 font-mono">
                      {formatCost(experimentCost(record))}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-sm leading-6 text-bench-muted">
            Completed comparisons will appear here for quick review.
          </div>
        )}
      </div>
    </section>
  );
}
