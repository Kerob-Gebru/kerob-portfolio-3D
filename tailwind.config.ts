import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05070c",
        "void-2": "#0b0f18",
        regolith: "#c9ccd3",
        dust: "#8b909b",
        signal: "#35d0c0", // teal: labels, focus, progress
        ember: "#d98e4a", // amber: the rising orb, warm accents
        sunlit: "#f2e6c9",
      },
      fontFamily: {
        display: ["var(--font-display)", "Eurostile", "Arial Black", "sans-serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        hero: ["clamp(2.25rem, 8.6vw, 9rem)", { lineHeight: "1", letterSpacing: "0.24em" }],
        display: ["clamp(1.75rem, 4vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "0.02em" }],
        lead: ["clamp(1.125rem, 1.6vw, 1.5rem)", { lineHeight: "1.45", letterSpacing: "-0.01em" }],
        body: ["clamp(0.9375rem, 1.05vw, 1.0625rem)", { lineHeight: "1.65", letterSpacing: "-0.005em" }],
        label: ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.16em" }],
      },
      keyframes: {
        "leg-in": {
          from: { opacity: "0", transform: "translate3d(0, 12px, 0)" },
        },
      },
      animation: {
        "leg-in": "leg-in 0.6s cubic-bezier(0.2, 0.7, 0.1, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
