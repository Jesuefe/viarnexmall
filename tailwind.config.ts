import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1B2D",
          800: "#16263C",
          700: "#1D3049",
        },
        porcelain: "#F7F5F1",
        jade: {
          DEFAULT: "#2FA084",
          soft: "#E4F3EE",
        },
        amber: {
          DEFAULT: "#E8A33D",
          soft: "#FBEBD2",
        },
        cinnabar: "#C1443A",
        slate: {
          DEFAULT: "#5B6B82",
          light: "#8E9AAC",
        },
        // 1688-style storefront palette — used by the mobile shopping UI
        market: {
          bg: "#F5F5F5", // page background — light gray, not white
          card: "#FFFFFF",
          orange: "#FF6A00", // primary brand / active states
          "orange-soft": "#FFF1E6",
          price: "#FF4400", // price text specifically — slightly redder than brand orange
          border: "#EEEEEE",
          text: "#1A1A1A",
          "text-secondary": "#888888",
          gold: "#FFB800", // rating stars, badges
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
