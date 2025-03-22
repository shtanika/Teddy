import type { Config } from "tailwindcss";
import { theme } from "./src/styles/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['var(--font-quicksand)'],
      },
      colors: {
        teddy: {
          beige: 'hsl(var(--teddy-beige) / <alpha-value>)',
          light: 'hsl(var(--teddy-light) / <alpha-value>)',
          brown: 'hsl(var(--teddy-brown) / <alpha-value>)',
          accent: 'hsl(var(--teddy-accent) / <alpha-value>)',
          muted: 'hsl(var(--teddy-muted) / <alpha-value>)',
        },
      },
      boxShadow: theme.shadows,
      borderRadius: theme.borderRadius,
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        smooth: '300ms',
      },
      spacing: theme.spacing,
      backdropBlur: theme.blur,
    },
  },
  plugins: [],
};

export default config; 