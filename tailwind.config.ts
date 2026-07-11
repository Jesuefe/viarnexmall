import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1B2D", // primary dark surface — the "night route" background
          800: "#16263C",
          700: "#1D3049",
        },
        porcelain: "#F7F5F1", // light surface
        jade: {
          DEFAULT: "#2FA084", // verification / trust / success
          soft: "#E4F3EE",
        },
        amber: {
          DEFAULT: "#E8A33D", // currency / primary CTA
          soft: "#FBEBD2",
        },
        cinnabar: "#C1443A", // used sparingly — alerts, red-seal nod
        slate: {
          DEFAULT: "#5B6B82", // secondary text
          light: "#8E9AAC",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "route-line":
          "linear-gradient(90deg, transparent 0%, #E8A33D 15%, #2FA084 85%, transparent 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
