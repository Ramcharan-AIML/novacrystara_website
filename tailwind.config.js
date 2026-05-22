/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: "#00f2fe",
          blue: "#4facfe",
          purple: "#7f00ff",
          pink: "#f107a3",
          dark: "#0b0c10",
          card: "rgba(15, 23, 42, 0.65)",
          border: "rgba(0, 242, 254, 0.15)",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
        cyber: ["Oxanium", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 254, 0.2), 0 0 10px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(0, 242, 254, 0.6), 0 0 30px rgba(0, 242, 254, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}

