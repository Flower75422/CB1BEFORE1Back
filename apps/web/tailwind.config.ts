import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Ink" - Best for titles, primary buttons, and heavy icons
        brand: {
          black: "#1c1917",
        },
        // The "Stone" Palette - This handles your seamless textures
        stone: {
          50:  "#FDFBF7", // Your Sidebar & Page Background (The Paper)
          100: "#F5F5F4", // Hover states on the sidebar
          200: "#E7E5E4", // Thin borders and dividers
          400: "#a8a29e", // Secondary text (handles, timestamps)
          500: "#78716c", // Small UI details (initials/avatars)
        }
      },
      // Optional: Add a subtle shadow preset for your cards
      boxShadow: {
        'card': '0 2px 8px -2px rgba(28, 25, 23, 0.08), 0 1px 3px -1px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;