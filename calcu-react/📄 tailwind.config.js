/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primario: "#034b80",
        secundario: "#e8f0ff",
        borde: "#d9e2ef",
        acento: "#0077cc",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
