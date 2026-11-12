"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  Code2,
  Megaphone,
  PenLine,
} from "lucide-react";
import { promptModes } from "@/lib/models/modes";
import type { PromptModeId } from "@/types";
import clsx from "clsx";

const modeIcons: Record<PromptModeId, LucideIcon> = {
  "creative-writer": PenLine,
  "business-analyst": BriefcaseBusiness,
  "sales-copywriter": Megaphone,
  "software-engineer": Code2,
  "agent-planner": Bot,
  "critical-reviewer": ClipboardCheck,
};

interface ModeSelectorProps {
  selectedModeIds: PromptModeId[];
  onToggleMode: (modeId: PromptModeId) => void;
}

export function ModeSelector({
  selectedModeIds,
  onToggleMode,
}: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {promptModes.map((mode) => {
        const Icon = modeIcons[mode.id];
        const selected = selectedModeIds.includes(mode.id);

        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggleMode(mode.id)}
            className={clsx(
              "group relative min-h-[148px] overflow-hidden rounded-lg border p-3 text-left transition duration-200",
              selected
                ? "border-white/25 bg-white/[0.095] shadow-panel"
                : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.075]",
            )}
            style={{
              boxShadow: selected
                ? `0 0 0 1px ${mode.accent}55, 0 18px 60px rgba(0,0,0,0.28)`
                : undefined,
            }}
          >
            <span
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: mode.accent }}
            />
            <span className="flex items-start justify-between gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 bg-black/[0.35] text-white">
                <Icon className="h-4 w-4" style={{ color: mode.accent }} />
              </span>
              <span
                className={clsx(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold",
                  selected
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 bg-black/20 text-bench-muted",
                )}
              >
                {selected ? (
                  <>
                    <Check className="h-3 w-3" />
                    Selected
                  </>
                ) : (
                  "Available"
                )}
              </span>
            </span>
            <span className="mt-3 block text-sm font-semibold text-white">
              {mode.name}
            </span>
            <span className="mt-1 block text-xs text-cyan-100">
              {mode.role}
            </span>
            <span className="mt-3 line-clamp-2 block text-xs leading-5 text-bench-muted">
              {mode.summary}
            </span>
          </button>
        );
      })}
    </div>
  );
}
