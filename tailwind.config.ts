// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5733', // A vibrant, high-contrast primary color
        secondary: '#0057FF', // A cool, secondary color
        accent: '#FFC300', // A bright accent color
        background: '#121212', // A dark background for high contrast
        foreground: '#F0F0F0', // Light text color
        'muted-text': '#A0A0A0', // Muted text for descriptions
        card: '#1E1E1E', // Darker card background
        border: '#333333', // Border color
      },
      borderRadius: {
        '2xl': '1rem',
        xl: '0.75rem',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
