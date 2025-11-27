/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Modern Swiss" Palette
        brand: {
          // Core Brand Colors
          indigo: '#4F46E5', // Electric Indigo (Primary)
          coral: '#F43F5E',  // Living Coral (Community/Accent)
          teal: '#059669',   // Field Teal (Success/Finance)
          
          // Backgrounds
          canvas: '#F8FAFC', // Slate 50 (App Background)
          surface: '#FFFFFF', // Pure White (Card Background)
          
          // Typography
          ink: {
            900: '#0F172A', // Primary Text (Deep Navy)
            500: '#64748B', // Secondary Text (Cool Grey)
            300: '#CBD5E1', // Borders
          }
        }
      },
      fontFamily: {
        // Suggesting 'Clash Display' or 'Cabinet Grotesk' for a unique header feel
        display: ['Clash Display', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        // "Float" effects - colored shadows for a modern feel
        'soft-indigo': '0 10px 40px -10px rgba(79, 70, 229, 0.2)',
        'soft-coral': '0 10px 40px -10px rgba(244, 63, 94, 0.2)',
        'card': '0 2px 8px rgba(15, 23, 42, 0.04), 0 12px 24px -12px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
