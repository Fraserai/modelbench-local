"use client";

import { LoaderCircle, Play } from "lucide-react";

interface RunButtonProps {
  disabled: boolean;
  isRunning: boolean;
  onRun: () => void;
}

export function RunButton({ disabled, isRunning, onRun }: RunButtonProps) {
  return (
    <button
      type="button"
      onClick={onRun}
      disabled={disabled || isRunning}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/70 bg-white px-4 text-sm font-semibold text-black shadow-[0_16px_50px_rgba(94,255,220,0.18)] transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/20 disabled:text-white/55"
    >
      {isRunning ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <Play className="h-4 w-4 fill-white/20" />
      )}
      {isRunning ? "Running" : "Run comparison"}
    </button>
  );
}
