"use client";

import type { LucideIcon } from "lucide-react";
import { Cpu, Database, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/lab/AppShell";
import { ExperimentHistoryPanel } from "@/components/lab/ExperimentHistoryPanel";
import { PromptInputPanel } from "@/components/lab/PromptInputPanel";
import { PromptLibraryPanel } from "@/components/lab/PromptLibraryPanel";
import { ResultsComparisonGrid } from "@/components/lab/ResultsComparisonGrid";
import { useExperimentLab } from "@/hooks/useExperimentLab";
import { promptModes } from "@/lib/models/modes";
import { providerList } from "@/lib/models/providers";
import { formatCost } from "@/lib/token-costs/estimate";

export function LabDashboard() {
  const {
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
  } = useExperimentLab();

  const aside = (
    <>
      <PromptLibraryPanel onSelectPrompt={selectPrompt} />
      <ExperimentHistoryPanel
        history={history}
        activeExperimentId={activeExperimentId}
        onSelectExperiment={selectExperiment}
        onClearHistory={clearExperimentHistory}
      />
    </>
  );

  return (
    <AppShell aside={aside}>
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_520px]">
          <div className="ai-surface rounded-lg p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-bench-muted">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-300/25 bg-teal-300/10 px-2.5 py-1 font-semibold text-teal-100">
                <Sparkles className="h-3.5 w-3.5" />
                AI evaluation lab
              </span>
              <span className="rounded-md border border-fuchsia-300/20 bg-fuchsia-400/10 px-2.5 py-1 text-fuchsia-100">
                Model-ready workflow
              </span>
              <span className="rounded-md border border-lime-300/20 bg-lime-400/10 px-2.5 py-1 text-lime-100">
                Private local runs
              </span>
            </div>
            <div className="mt-4 max-w-4xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Benchmark prompts before they reach production.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-bench-muted">
                ModelBench turns one task into a side-by-side quality readout so
                teams can compare output style, score fit, and keep the best
                experiments close.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-bench-muted">
              <span className="ai-chip rounded-md px-2.5 py-1">
                No account setup
              </span>
              <span className="ai-chip rounded-md px-2.5 py-1">
                Scorecards included
              </span>
              <span className="ai-chip rounded-md px-2.5 py-1">
                History on device
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
            <MetricTile
              icon={Layers3}
              label="Queued modes"
              value={`${selectedModeIds.length}/${promptModes.length}`}
              tone="text-violet-100"
            />
            <MetricTile
              icon={Cpu}
              label="Prompt tokens"
              value={runSummary.inputTokens.toLocaleString()}
              tone="text-cyan-100"
            />
            <MetricTile
              icon={ShieldCheck}
              label="Avg quality"
              value={runSummary.score ? String(runSummary.score) : "--"}
              tone="text-emerald-100"
            />
            <MetricTile
              icon={Database}
              label="Run cost"
              value={formatCost(runSummary.totalCost)}
              tone="text-amber-100"
            />
          </div>
        </header>

        <PromptInputPanel
          prompt={prompt}
          selectedModeIds={selectedModeIds}
          isRunning={isRunning}
          onPromptChange={setPrompt}
          onToggleMode={toggleMode}
          onRun={runExperiment}
          onReset={resetPrompt}
        />

        {runError ? (
          <div className="mt-4 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100">
            {runError}
          </div>
        ) : null}

        <RunReadinessStrip
          selectedModeCount={selectedModeIds.length}
          savedRunCount={history.length}
        />

        <ResultsComparisonGrid outputs={outputs} isRunning={isRunning} />
      </div>
    </AppShell>
  );
}

interface MetricTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
}

function MetricTile({ icon: Icon, label, value, tone }: MetricTileProps) {
  return (
    <div className="ai-surface rounded-lg p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="ai-kicker text-[11px] font-semibold">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-md bg-white/[0.07]">
          <Icon className={`h-4 w-4 ${tone}`} />
        </span>
      </div>
      <div className="mt-2 truncate font-mono text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

interface RunReadinessStripProps {
  selectedModeCount: number;
  savedRunCount: number;
}

function RunReadinessStrip({
  selectedModeCount,
  savedRunCount,
}: RunReadinessStripProps) {
  return (
    <section className="ai-surface mt-4 rounded-lg p-3">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="ai-kicker text-[11px] font-semibold">
            Evaluation pipeline
          </div>
          <h2 className="mt-1 text-base font-semibold text-white">
            From prompt to scored decision in one pass
          </h2>
        </div>
        <div className="text-xs text-bench-muted">
          {savedRunCount}/14 runs saved locally
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <StatusTile
          icon={Layers3}
          label="1. Context"
          value={`${selectedModeCount} mode${selectedModeCount === 1 ? "" : "s"} queued`}
          detail="The same task is sent through each selected expert lens"
          tone="bg-cyan-300"
        />
        <StatusTile
          icon={Cpu}
          label="2. Simulation"
          value="Local execution"
          detail={`${providerList.length} provider labels, no external keys needed`}
          tone="bg-violet-300"
        />
        <StatusTile
          icon={ShieldCheck}
          label="3. Decision"
          value="Quality readout"
          detail="Outputs return with scores, cost, latency, and history"
          tone="bg-emerald-300"
        />
      </div>
    </section>
  );
}

interface StatusTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: string;
}

function StatusTile({ icon: Icon, label, value, detail, tone }: StatusTileProps) {
  return (
    <div className="ai-surface-soft flex min-h-[92px] items-center justify-between gap-3 rounded-lg px-3 py-3">
      <div className="min-w-0">
        <div className="ai-kicker text-[11px] font-semibold">{label}</div>
        <div className="mt-1 truncate text-sm font-semibold text-white">
          {value}
        </div>
        <div className="mt-1 truncate text-xs text-bench-muted">{detail}</div>
      </div>
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/[0.07]">
        <span className={`absolute right-1 top-1 h-2 w-2 rounded-full ${tone}`} />
        <Icon className="h-4 w-4 text-white/80" />
      </span>
    </div>
  );
}
