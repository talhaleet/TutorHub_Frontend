// tailwind.config.js — TutorHub design system tokens
/** @type {import('tailwindcss').Config} */
export default {
 content: [
 './index.html',
 './src/**/*.{js,ts,jsx,tsx}',
 // ^ Scans all JS/JSX files for class names. Without this, Tailwind
 // purges all classes and your app renders unstyled.
 ],
 theme: {
 extend: {
 colors: {
 // ── Primary palette ─────────────────────────────────────────────
 primary: {
 DEFAULT: '#1F3864', // Navy — buttons, nav, active states
 dark: '#162A4A', // Darker navy for hover states
 light: '#D6E4F0', // Light blue — backgrounds, tags
 },
 // ── Accent ──────────────────────────────────────────────────────
 accent: {
 DEFAULT: '#2E74B5', // Medium blue — links, icons, focus rings
 light: '#BDD7EE', // Soft blue — badges
 },
 // ── Semantic colors ─────────────────────────────────────────────
 success: {
 DEFAULT: '#375623', // Dark green
 light: '#E2EFDA', // Light green background
 },
 warning: {
 DEFAULT: '#BF8F00', // Amber
 light: '#FFF2CC', // Light amber background
 },
 error: {
 DEFAULT: '#C00000', // Red
 light: '#FFF0F0', // Light red background
 },
 // ── Neutral scale ───────────────────────────────────────────────
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
 fontFamily: {
 sans: ['Inter', 'system-ui', 'sans-serif'],
 // Inter is professional and used by Vercel, Linear, Notion
 },
 boxShadow: {
 card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
 navbar: '0 1px 3px rgba(0,0,0,0.06)',
 lg: '0 10px 25px rgba(0,0,0,0.12)',
 },
 borderRadius: {
 xl: '12px',
 '2xl':'16px',
 '3xl':'24px',
 },
 }
 },
 plugins: [],
}