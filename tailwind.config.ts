import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1D1D1F",
        muted: "#6E6E73",
        line: "#D2D2D7",
        surface: "#F5F5F7",
        brand: "#0A6C64",
        "brand-dark": "#063F3A",
        accent: "#0A6C64"
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ]
      },
      letterSpacing: {
        tightest: "-0.04em"
      }
    }
  },
  plugins: []
};

export default config;
