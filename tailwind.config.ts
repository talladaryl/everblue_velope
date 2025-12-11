import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Utilise les classes .dark/.light
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Utilise tes variables HSL existantes
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Pour notre système de thème personnalisé
        brand: "hsl(var(--brand))",
      },
      // Compatibilité avec notre système de thème
      backgroundColor: {
        primary: "hsl(var(--bg-primary))",
        secondary: "hsl(var(--bg-secondary))",
        tertiary: "hsl(var(--bg-tertiary))",
      },
      textColor: {
        primary: "hsl(var(--text-primary))",
        secondary: "hsl(var(--text-secondary))",
        tertiary: "hsl(var(--text-tertiary))",
      },
      borderColor: {
        primary: "hsl(var(--border-primary))",
        secondary: "hsl(var(--border-secondary))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
