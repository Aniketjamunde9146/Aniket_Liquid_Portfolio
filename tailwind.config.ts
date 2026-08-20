import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        bg: "#050810",
        "bg-2": "#0a0f1c",
        surface: "rgba(255,255,255,0.04)",
        "surface-2": "rgba(255,255,255,0.07)",
        border: "rgba(255,255,255,0.08)",
        "border-2": "rgba(255,255,255,0.16)",
        "text-primary": "#f5f6fa",
        "text-secondary": "rgba(245,246,250,0.65)",
      },
      backdropBlur: {
        "18": "18px",
        "24": "24px",
      },
      transitionDuration: {
        mid: "350ms",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
        snap: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      animation: {
        grain: "grain 8s steps(10) infinite",
        "dot-pulse": "dotPulse 2s ease-in-out infinite",
        "mouse-dot": "mouseDot 1.6s ease-in-out infinite",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-4%)" },
          "30%": { transform: "translate(3%,2%)" },
          "50%": { transform: "translate(-4%,3%)" },
          "70%": { transform: "translate(2%,-3%)" },
          "90%": { transform: "translate(-3%,4%)" },
        },
        dotPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.4)" },
        },
        mouseDot: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(8px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;