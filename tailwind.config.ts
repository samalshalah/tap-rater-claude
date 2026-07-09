import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#667085",
        line: "#E5E7EB",
        brand: "#0B7A75",
        accent: "#F5A524"
      }
    }
  },
  plugins: []
};

export default config;
