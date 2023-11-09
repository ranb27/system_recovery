/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // that is animation class
      animation: {
        fade: "fadeOut 1s ease-in-out",
        delay: "delay 1.2s ease-in-out",
        rtl: "rtl 1s ease-in-out",
      },

      // that is actual animation
      keyframes: () => ({
        fadeOut: {
          "0%": { opacity: 0, transform: "translateY(32px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        delay: {
          "0%": { opacity: 0, transform: "translateY(32px)" },
          "50%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        rtl: {
          "0%": { opacity: 0, transform: "translateX(50%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      }),
    },
  },
  plugins: [],
};
