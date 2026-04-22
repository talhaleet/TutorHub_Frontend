/** @type {import('tailwindcss').Config} */
// tailwind.config.js — TutorHub brand configuration
// This file is read by the Tailwind CSS compiler during build.
// Every class defined here becomes available as a Tailwind utility.

export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}", // scan all JS/JSX files in src/
];
export const theme = {
  extend: {
    // ── Color Palette ─────────────────────────────────────────
    // These colors define the TutorHub visual identity.
    // Usage: bg-primary, text-accent, border-primaryLight, etc.
    colors: {
      // Primary navy — main brand color for headers, CTAs, and important text
      primary: {
        DEFAULT: '#1B3C6B', // Deep navy blue — authoritative and trustworthy
        light: '#2E5FA3', // Medium blue — sub-headings and secondary buttons
        dark: '#0F2744', // Darker navy — hover states on primary elements
      },
      // Accent sky blue — used for highlights, links, and interactive elements
      accent: {
        DEFAULT: '#0EA5E9', // Sky blue — modern, energetic, tech-forward
        hover: '#0284C7', // Slightly darker for hover states
        light: '#E0F2FE', // Very light tint for backgrounds and badges
      },
      // Success green — confirmations, verified badges, positive states
      success: {
        DEFAULT: '#22C55E',
        light: '#DCFCE7',
      },
      // Warning amber — pending states, notices
      warning: {
        DEFAULT: '#F59E0B',
        light: '#FEF3C7',
      },
      // Error red — validation errors, rejected states
      error: {
        DEFAULT: '#EF4444',
        light: '#FEE2E2',
      },
      // Neutral grays — text, borders, backgrounds
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
    },

    // ── Typography ────────────────────────────────────────────
    // Using system font stack — no Google Fonts needed (avoids CORS/privacy issues)
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      // ^ Inter is the primary font. Falls back to system fonts if not loaded.
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      // ^ Monospace for code snippets and tokens
    },

    // ── Custom Shadows ────────────────────────────────────────
    boxShadow: {
      card: '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
      navbar: '0 1px 8px 0 rgba(27,60,107,0.12)',
      // ^ Subtle navy-tinted shadow for the navbar
      dropdown: '0 10px 25px -3px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.08)',
      // ^ More pronounced shadow for dropdown menus (float effect)
    },

    // ── Border Radius ─────────────────────────────────────────
    borderRadius: {
      xl: '0.75rem', // 12px — cards and modals
      '2xl': '1rem', // 16px — large containers
      '3xl': '1.5rem', // 24px — hero sections
    },

    // ── Transitions ───────────────────────────────────────────
    transitionDuration: {
      250: '250ms', // fast UI responses
      400: '400ms', // smooth page transitions
    },
  },
};
export const plugins = [];