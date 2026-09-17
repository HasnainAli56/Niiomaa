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
        background: "#00142C",
        "nioma-blue": "#00142C",
        "nioma-purple": "#702FA0",
        "nioma-purple-nav": "rgba(149, 8, 188, 0.45)",
        "nioma-purple-hover": "#8237BA",
      },
      fontFamily: {
        rethink: ['"Rethink Sans"', "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
export default config;
