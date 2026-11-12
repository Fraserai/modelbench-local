"use client";

import { averageScore, scoreLabels } from "@/lib/evals/score";
import type { ScoreKey, Scorecard as ScorecardType } from "@/types";
import clsx from "clsx";

const scoreKeys: ScoreKey[] = [
  "clarity",
  "usefulness",
  "specificity",
  "creativity",
  "businessValue",
];

function scoreTone(score: number) {
  if (score >= 88) {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (score >= 78) {
    return "border-cyan-300/25 bg-cyan-400/10 text-cyan-100";
  }

  return "border-amber-300/25 bg-amber-400/10 text-amber-100";
}

interface ScorecardProps {
  scorecard: ScorecardType;
}

export function Scorecard({ scorecard }: ScorecardProps) {
  return (
    <div className="ai-surface-soft space-y-3 rounded-lg p-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Scorecard</h3>
        <span
          className={clsx(
            "rounded-md border px-2 py-1 text-xs font-semibold",
            scoreTone(averageScore(scorecard)),
          )}
        >
          {averageScore(scorecard)} avg
        </span>
      </div>
      <div className="grid gap-2">
        {scoreKeys.map((key) => (
          <div key={key} className="grid grid-cols-[118px_minmax(0,1fr)_44px] items-center gap-2">
            <span className="truncate text-xs text-bench-muted">
              {scoreLabels[key]}
            </span>
            <span className="h-2 overflow-hidden rounded-md bg-white/10">
              <span
                className="block h-full rounded-md bg-gradient-to-r from-teal-300 via-fuchsia-300 to-lime-300"
                style={{ width: `${scorecard[key]}%` }}
              />
            </span>
            <span
              className={clsx(
                "rounded-md border px-1.5 py-1 text-center text-xs font-semibold",
                scoreTone(scorecard[key]),
              )}
            >
              {scorecard[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
