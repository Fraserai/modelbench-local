"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/lab/Sidebar";

interface AppShellProps {
  children: ReactNode;
  aside: ReactNode;
}

export function AppShell({ children, aside }: AppShellProps) {
  return (
    <div className="lab-backdrop min-h-screen overflow-x-hidden text-bench-text">
      <div className="lab-grid pointer-events-none fixed inset-0" />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[76px_minmax(0,1fr)_380px]">
        <Sidebar />
        <main className="min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          {children}
        </main>
        <aside className="min-w-0 border-t border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl lg:border-l lg:border-t-0 lg:px-5 lg:py-6">
          <div className="sticky top-5 space-y-4">{aside}</div>
        </aside>
      </div>
    </div>
  );
}
