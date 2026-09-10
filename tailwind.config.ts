import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Inter'",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        jp: ["'Noto Sans JP'", "sans-serif"],
      },
      colors: {
        ink: "#1a1a1a",
        paper: "#fafaf8",
        line: "#e8e6e1",
        accent: "#c15b4a",
        accent2: "#2f6f5e",
        muted: "#8a8781",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
