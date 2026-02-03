/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'figtree',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif'
        ],
      },
      fontSize: {
        'xs': '0.75rem',      // 12px - Small text
        'sm': '0.875rem',     // 14px - Secondary text
        'base': '1rem',       // 16px - Body text
        'lg': '1.125rem',     // 18px - Large text
        'xl': '1.25rem',      // 20px - Headings
        '2xl': '1.5rem',      // 24px - Subheadings
        '3xl': '1.875rem',    // 30px - Section headers
        '4xl': '2.25rem',     // 36px - Main headers
        '5xl': '3rem',        // 48px - Hero text
        '6xl': '3.75rem',     // 60px - Display text
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      width: ['max-sm'],
      display: ['max-sm'],
      fontSize: ['max-sm'],
      padding: ['max-sm'],
      margin: ['max-sm'],
      flexDirection: ['max-sm'],
      gridTemplateColumns: ['max-sm'],
      // Add any other utilities you need for smaller screens
    },
  },
}