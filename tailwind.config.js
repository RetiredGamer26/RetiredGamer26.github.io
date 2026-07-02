import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        "card-border": "hsl(var(--card-border))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        "popover-border": "hsl(var(--popover-border))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        "primary-border": "var(--primary-border)",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        "secondary-border": "var(--secondary-border)",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        "muted-border": "var(--muted-border)",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        "accent-border": "var(--accent-border)",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        "destructive-border": "var(--destructive-border)",
      },
      fontFamily: {
        sans: ["var(--app-font-sans)", "sans-serif"],
        mono: ["var(--app-font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
