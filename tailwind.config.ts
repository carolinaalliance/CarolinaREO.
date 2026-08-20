import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        reo: {
          950: "#020617",
          900: "#07111f",
          850: "#0b1625",
          800: "#0f1d2d",
          green: "#22c55e",
          emerald: "#16a34a",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(34,197,94,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
