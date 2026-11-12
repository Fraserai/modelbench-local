"use client";

import { Coins, Sigma } from "lucide-react";
import { formatCost } from "@/lib/token-costs/estimate";
import type { TokenCostEstimate as TokenCostEstimateType } from "@/types";

interface TokenEstimateProps {
  estimate: TokenCostEstimateType;
}

export function TokenEstimate({ estimate }: TokenEstimateProps) {
  return (
    <div className="ai-surface-soft rounded-lg p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Token and cost</h3>
        <span className="ai-chip inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-bench-muted">
          <Coins className="h-3.5 w-3.5 text-amber-200" />
          Simulated
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div>
          <div className="text-bench-muted">Input</div>
          <div className="mt-1 font-mono text-white">
            {estimate.inputTokens.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-bench-muted">Output</div>
          <div className="mt-1 font-mono text-white">
            {estimate.outputTokens.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-bench-muted">Total</div>
          <div className="mt-1 inline-flex items-center gap-1 font-mono text-white">
            <Sigma className="h-3.5 w-3.5 text-cyan-200" />
            {estimate.totalTokens.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-bench-muted">Cost</div>
          <div className="mt-1 font-mono text-white">
            {formatCost(estimate.totalCost)}
          </div>
        </div>
      </div>
    </div>
  );
}
