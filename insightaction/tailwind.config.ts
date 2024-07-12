import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "hsl(20, 14.3%, 4.1%)",
        foreground: "hsl(60, 9.1%, 97.8%)",
        card: "hsl(20, 14.3%, 4.1%)",
        cardForeground: "hsl(60, 9.1%, 97.8%)",
        popover: "hsl(20, 14.3%, 4.1%)",
        popoverForeground: "hsl(60, 9.1%, 97.8%)",
        primaryOrange: "hsl(20.5, 90.2%, 48.2%)",
        primaryForeground: "hsl(60, 9.1%, 97.8%)",
        secondary: "hsl(12, 6.5%, 15.1%)",
        secondaryForeground: "hsl(60, 9.1%, 97.8%)",
        muted: "hsl(12, 6.5%, 15.1%)",
        mutedForeground: "hsl(24, 5.4%, 63.9%)",
        accent: "hsl(12, 6.5%, 15.1%)",
        accentForeground: "hsl(60, 9.1%, 97.8%)",
        destructive: "hsl(0, 72.2%, 50.6%)",
        destructiveForeground: "hsl(60, 9.1%, 97.8%)",
        border: "hsl(12, 6.5%, 15.1%)",
        input: "hsl(12, 6.5%, 15.1%)",
        ring: "hsl(20.5, 90.2%, 48.2%)",
        done: "hsl(142.4 71.8% 29.2%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config