import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        cream: {
          50: "#FDFBF6",
          100: "#FAF7F0",
          200: "#F2ECDD",
          300: "#E5DDC4",
          400: "#C9BFA0",
          500: "#A89F82",
          600: "#8A8168",
          700: "#6B6856",
          800: "#3A3833",
          900: "#1A1917",
          950: "#0E0D0B",
        },
        brand: {
          langgraph: "#639922",
          autogen: "#378ADD",
          openai: "#1A1917",
          crewai: "#E24B4A",
          pydantic: "#D4537E",
          google: "#185FA5",
          hf: "#EF9F27",
          letta: "#7F77DD",
          mem0: "#1D9E75",
          anthropic: "#D85A30",
        },
      },
      maxWidth: {
        "reading": "68ch",
        "page": "1200px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
