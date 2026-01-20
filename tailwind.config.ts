import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B4513",
          light: "#A0522D",
          dark: "#654321",
        },
        secondary: {
          DEFAULT: "#E88C30",
          light: "#FFA54F",
          dark: "#D67820",
        },
        background: {
          DEFAULT: "#F9F5E8",
          light: "#FFFEF9",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
