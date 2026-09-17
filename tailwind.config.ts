import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#07080A", 900: "#0B0D10", 800: "#101317", 700: "#161A1F", 600: "#1E232A" },
        bone: { DEFAULT: "#E6E1D5", dim: "#A9A59B" },
        mute: "#878E96",
        laterite: { DEFAULT: "#E4602F", soft: "#F0B37E", deep: "#8F3517" },
        mint: { DEFAULT: "#6FC3B5", pale: "#D6F5E8", deep: "#16464A" },
      },
      fontFamily: {
        sans: ['"Geist Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono Variable"', "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ['"Instrument Serif"', "ui-serif", "Georgia", "serif"],
      },
      maxWidth: { frame: "1600px" },
      letterSpacing: { tightest: "-0.045em" },
    },
  },
  plugins: [],
} satisfies Config;
