"use client";

import { AlertTriangle, Check, Clock3, Copy, Server, Trophy } from "lucide-react";
import { useState } from "react";
import { modeById } from "@/lib/models/modes";
import type { ExperimentOutput } from "@/types";
import { Scorecard } from "@/components/lab/Scorecard";
import { TokenEstimate } from "@/components/lab/TokenEstimate";

interface ResultCardProps {
  output: ExperimentOutput;
  isTopResult?: boolean;
}

export function ResultCard({ output, isTopResult = false }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const mode = modeById[output.modeId];

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output.output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      className="ai-surface flex min-h-[560px] flex-col rounded-lg transition duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow: isTopResult
          ? "0 28px 90px rgba(0,0,0,0.48), 0 0 0 1px rgba(190,242,100,0.26), inset 0 1px 0 rgba(255,255,255,0.08)"
          : undefined,
      }}
    >
      <div className="border-b border-white/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
                style={{ backgroundColor: mode.accent }}
              />
              <h2 className="truncate text-base font-semibold text-white">
                {output.modeName}
              </h2>
              {isTopResult ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-lime-300/25 bg-lime-300/10 px-2 py-1 text-[11px] font-semibold text-lime-100">
                  <Trophy className="h-3 w-3" />
                  Top match
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-bench-muted">
              <span className="ai-chip inline-flex items-center gap-1 rounded-md px-2 py-1">
                <Server className="h-3.5 w-3.5 text-cyan-200" />
                {output.providerLabel}
              </span>
              <span className="ai-chip rounded-md px-2 py-1 font-mono">
                {output.modelName}
              </span>
              <span className="ai-chip inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono">
                <Clock3 className="h-3.5 w-3.5 text-teal-200" />
                {output.metadata.latencyMs}ms
              </span>
              {output.status === "error" ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-rose-300/20 bg-rose-400/10 px-2 py-1 text-rose-100">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Error
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={copyOutput}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-bench-muted transition hover:bg-white/10 hover:text-white"
            aria-label="Copy output"
            title="Copy output"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-200" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="scrollbar-thin min-h-[250px] flex-1 overflow-auto p-4">
        <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-100">
          {output.output}
        </pre>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-bench-muted">
          <span className="ai-chip rounded-md px-2 py-1">
            {output.metadata.adapterId}
          </span>
          <span className="ai-chip rounded-md px-2 py-1">
            {output.metadata.rubricVersion}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <Scorecard scorecard={output.scorecard} />
        <TokenEstimate estimate={output.tokenEstimate} />
      </div>
    </article>
  );
}
