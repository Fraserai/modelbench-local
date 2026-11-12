"use client";

import { BookOpen, CornerDownRight } from "lucide-react";
import { promptLibrary } from "@/lib/prompts/library";
import type { PromptLibraryItem } from "@/types";

interface PromptLibraryPanelProps {
  onSelectPrompt: (item: PromptLibraryItem) => void;
}

export function PromptLibraryPanel({ onSelectPrompt }: PromptLibraryPanelProps) {
  return (
    <section
      id="library"
      className="ai-surface rounded-lg"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-teal-300/10 text-teal-100">
              <BookOpen className="h-4 w-4" />
            </span>
            Prompt Library
          </div>
          <p className="mt-1 text-xs text-bench-muted">
            Curated starting points
          </p>
        </div>
        <span className="ai-chip rounded-md px-2 py-1 text-xs text-bench-muted">
          {promptLibrary.length}
        </span>
      </div>
      <div className="divide-y divide-white/10">
        {promptLibrary.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPrompt(item)}
            className="group w-full p-4 text-left transition hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {item.title}
                </div>
                <div className="mt-1 text-xs text-teal-100">{item.category}</div>
              </div>
              <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-bench-muted transition group-hover:text-white" />
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-bench-muted">
              {item.prompt}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
