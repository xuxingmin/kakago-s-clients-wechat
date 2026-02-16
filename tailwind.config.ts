import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
      },
      colors: {
        /* ═══════════════════════════════════════════════════════════
           KAKAGO MASTER COLOR SYSTEM - Tailwind Mapping
           ═══════════════════════════════════════════════════════════ */
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

        /* ─────────────────────────────────────────────────────────────
           🟣 PURPLE SPECTRUM
           ───────────────────────────────────────────────────────────── */
        purple: {
          50: "hsl(var(--purple-50))",
          100: "hsl(var(--purple-100))",
          200: "hsl(var(--purple-200))",
          300: "hsl(var(--purple-300))",
          400: "hsl(var(--purple-400))",
          500: "hsl(var(--purple-500))",
          600: "hsl(var(--purple-600))",
          700: "hsl(var(--purple-700))",
          800: "hsl(var(--purple-800))",
          900: "hsl(var(--purple-900))",
          DEFAULT: "hsl(var(--purple-500))",
        },

        /* ─────────────────────────────────────────────────────────────
           🔘 FOG GREY SPECTRUM
           ───────────────────────────────────────────────────────────── */
        fog: {
          50: "hsl(var(--fog-50))",
          100: "hsl(var(--fog-100))",
          200: "hsl(var(--fog-200))",
          300: "hsl(var(--fog-300))",
          400: "hsl(var(--fog-400))",
          500: "hsl(var(--fog-500))",
          600: "hsl(var(--fog-600))",
          700: "hsl(var(--fog-700))",
          800: "hsl(var(--fog-800))",
          900: "hsl(var(--fog-900))",
          DEFAULT: "hsl(var(--fog-700))",
        },

        /* ─────────────────────────────────────────────────────────────
           ⚫ BLACK SPECTRUM
           ───────────────────────────────────────────────────────────── */
        obsidian: "hsl(var(--obsidian))",
        void: "hsl(var(--void))",
        charcoal: "hsl(var(--charcoal))",
        onyx: "hsl(var(--onyx))",

        /* 🟢 Emerald - Positive Metrics */
        emerald: {
          400: "hsl(var(--emerald-400))",
          500: "hsl(var(--emerald-500))",
          600: "hsl(var(--emerald-600))",
          DEFAULT: "hsl(var(--emerald-500))",
        },

        /* ─────────────────────────────────────────────────────────────
           ⚪ WHITE SPECTRUM (for opacity utilities)
           ───────────────────────────────────────────────────────────── */
        white: {
          DEFAULT: "hsl(var(--white-100))",
          90: "hsl(var(--white-90))",
          70: "hsl(var(--white-70))",
          50: "hsl(var(--white-50))",
          30: "hsl(var(--white-30))",
          15: "hsl(var(--white-15))",
          8: "hsl(var(--white-08))",
          4: "hsl(var(--white-04))",
        },

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        /* Elevation System */
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        /* Purple Glow */
        "purple-sm": "var(--shadow-purple-sm)",
        purple: "var(--shadow-purple)",
        "purple-lg": "var(--shadow-purple-lg)",
        glow: "var(--shadow-glow)",
        /* Special */
        inner: "var(--shadow-inner)",
        "inner-strong": "var(--shadow-inner-strong)",
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "reveal": {
          "0%": { opacity: "0", filter: "blur(20px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "slide-up": "slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "reveal": "reveal 1s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
