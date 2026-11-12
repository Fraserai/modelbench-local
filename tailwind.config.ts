import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bench: {
          ink: "#070914",
          panel: "#0d1220",
          panel2: "#111827",
          line: "#263249",
          text: "#e6eefc",
          muted: "#8ea0bd",
        },
      },
      boxShadow: {
        glow: "0 24px 80px rgba(80, 120, 255, 0.18)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
