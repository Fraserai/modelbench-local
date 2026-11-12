"use client";

import {
  BookOpen,
  Clock3,
  FlaskConical,
  Gauge,
  Settings,
  SquareStack,
} from "lucide-react";

const navItems = [
  { label: "Lab", href: "#prompt", icon: FlaskConical },
  { label: "Results", href: "#results", icon: SquareStack },
  { label: "Scores", href: "#results", icon: Gauge },
  { label: "Library", href: "#library", icon: BookOpen },
  { label: "History", href: "#history", icon: Clock3 },
];

export function Sidebar() {
  return (
    <nav className="flex border-b border-white/10 bg-black/[0.45] px-3 py-3 backdrop-blur-xl lg:min-h-screen lg:flex-col lg:items-center lg:border-b-0 lg:border-r lg:px-0 lg:py-5">
      <a
        href="#prompt"
        className="mr-3 grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-teal-200/30 bg-teal-300/10 text-teal-100 shadow-[0_0_35px_rgba(45,255,214,0.18)] lg:mr-0"
        aria-label="ModelBench home"
      >
        <FlaskConical className="h-5 w-5" />
      </a>
      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto lg:mt-8 lg:flex-none lg:flex-col lg:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className="group grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-transparent text-bench-muted transition hover:border-white/10 hover:bg-white/10 hover:text-white"
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5 transition group-hover:scale-105" />
            </a>
          );
        })}
      </div>
      <a
        href="#prompt"
        className="hidden h-11 w-11 place-items-center rounded-lg border border-transparent text-bench-muted transition hover:border-white/10 hover:bg-white/10 hover:text-white lg:mt-auto lg:grid"
        title="Settings"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </a>
    </nav>
  );
}
