/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [daisyui],
  theme: {
    extend: {
      colors: {
        "info-muted": "oklch(var(--info-muted) / <alpha-value>)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          primary: "#00D2F9",
          secondary: "#008FAA",
          info: "#3b82f6",
          error: "#de1e1e",
          "--info-muted": "338 83% 66%",
        },
      },
    ],
  },
} satisfies Config;
