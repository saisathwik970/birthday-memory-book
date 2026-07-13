/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bmb: {
          purple: "#7c3aed",
          pink: "#ec4899",
          gold: "#fbbf24",
          blue: "#3b82f6",
          dark: "#0f0620",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
      backgroundImage: {
        "birthday-gradient":
          "linear-gradient(135deg, #0f0620 0%, #2d1155 35%, #5b189c 65%, #9d2eb5 100%)",
        "gold-shine": "linear-gradient(90deg, #fbbf24, #ec4899, #7c3aed, #fbbf24)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(236, 72, 153, 0.45)",
        "glow-gold": "0 0 30px rgba(251, 191, 36, 0.5)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
