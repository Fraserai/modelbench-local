"use client";

import { Activity, Coins, Gauge, PanelTopOpen, Trophy } from "lucide-react";
import type { ExperimentOutput } from "@/types";
import { ResultCard } from "@/components/lab/ResultCard";
import { averageScore } from "@/lib/evals/score";
import { formatCost } from "@/lib/token-costs/estimate";

interface ResultsComparisonGridProps {
  outputs: ExperimentOutput[];
  isRunning: boolean;
}

export function ResultsComparisonGrid({
  outputs,
  isRunning,
}: ResultsComparisonGridProps) {
  const bestOutput = outputs.reduce<ExperimentOutput | null>((best, output) => {
    if (!best) {
      return output;
    }

    return averageScore(output.scorecard) > averageScore(best.scorecard)
      ? output
      : best;
  }, null);
  const averageQuality =
    outputs.length > 0
      ? Math.round(
          outputs.reduce(
            (sum, output) => sum + averageScore(output.scorecard),
            0,
          ) / outputs.length,
        )
      : 0;
  const totalCost = outputs.reduce(
    (sum, output) => sum + output.tokenEstimate.totalCost,
    0,
  );

  return (
    <section id="results" className="mt-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-teal-300/10 text-teal-100">
              <PanelTopOpen className="h-4 w-4" />
            </span>
            Comparison results
          </div>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Scored outputs
          </h2>
        </div>
        <span className="ai-chip rounded-md px-2.5 py-1 text-xs text-bench-muted">
          {outputs.length} result{outputs.length === 1 ? "" : "s"}
        </span>
      </div>

      {isRunning ? (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="ai-surface min-h-[420px] animate-pulse rounded-lg p-4"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md border border-teal-300/20 bg-teal-300/10">
                    <Activity className="h-4 w-4 animate-pulse text-teal-100" />
                  </div>
                  <div>
                    <div className="h-3 w-28 rounded bg-white/15" />
                    <div className="mt-2 h-2 w-20 rounded bg-white/10" />
                  </div>
                </div>
                <div className="h-7 w-16 rounded-md bg-white/10" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-11/12 rounded bg-white/10" />
                <div className="h-3 w-4/5 rounded bg-white/10" />
                <div className="h-3 w-9/12 rounded bg-white/10" />
              </div>
              <div className="mt-8 space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="h-6 w-12 rounded-md bg-teal-300/15" />
                </div>
                <div className="h-2 w-full rounded bg-white/10" />
                <div className="h-2 w-10/12 rounded bg-white/10" />
                <div className="h-2 w-11/12 rounded bg-white/10" />
              </div>
              <p className="mt-5 text-xs leading-5 text-bench-muted">
                Running local comparison and preparing scorecards.
              </p>
            </div>
          ))}
        </div>
      ) : outputs.length > 0 ? (
        <>
          <div className="ai-surface mb-4 grid gap-3 rounded-lg p-3 md:grid-cols-3">
            <ResultInsight
              icon={Trophy}
              label="Top match"
              value={bestOutput?.modeName ?? "--"}
              detail={
                bestOutput
                  ? `${averageScore(bestOutput.scorecard)} average quality`
                  : "Run a comparison"
              }
              tone="text-lime-100"
            />
            <ResultInsight
              icon={Gauge}
              label="Average quality"
              value={averageQuality ? String(averageQuality) : "--"}
              detail={`${outputs.length} scored output${outputs.length === 1 ? "" : "s"}`}
              tone="text-teal-100"
            />
            <ResultInsight
              icon={Coins}
              label="Estimated spend"
              value={formatCost(totalCost)}
              detail="Simulated provider pricing"
              tone="text-amber-100"
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {outputs.map((output) => (
              <ResultCard
                key={output.id}
                output={output}
                isTopResult={bestOutput?.id === output.id}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="ai-surface grid min-h-[340px] place-items-center rounded-lg border-dashed p-6 text-center">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-teal-300/20 bg-teal-300/10 text-teal-100">
              <PanelTopOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              Run a comparison to see scored outputs
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-bench-muted">
              Results appear here side by side with quality scores, model
              labels, and cost estimates for the current prompt.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

interface ResultInsightProps {
  icon: typeof Trophy;
  label: string;
  value: string;
  detail: string;
  tone: string;
}

function ResultInsight({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: ResultInsightProps) {
  return (
    <div className="ai-surface-soft flex min-h-[88px] items-center justify-between gap-3 rounded-lg p-3">
      <div className="min-w-0">
        <div className="ai-kicker text-[11px] font-semibold">{label}</div>
        <div className="mt-2 truncate text-base font-semibold text-white">
          {value}
        </div>
        <div className="mt-1 truncate text-xs text-bench-muted">{detail}</div>
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/[0.07]">
        <Icon className={`h-4 w-4 ${tone}`} />
      </span>
    </div>
  );
}
