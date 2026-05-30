import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        parable: {
          space: "#030712",
          midnight: "#0A1018",
          slate: "#0F1419",
          navy: "#111827",
          cyan: "#00D4FF",
          blue: "#00B8FF",
          azure: "#1EA7FF",
          purple: "#8B5CF6",
          violet: "#A855F7",
          "deep-violet": "#7C3AED",
        },
        cyber: "#00D4FF",
      },
    },
  },
  plugins: [],
};
export default config;
