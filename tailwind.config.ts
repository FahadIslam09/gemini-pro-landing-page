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
        brand: {
          blue: "#3157D5",
          indigo: "#5B55D8",
          purple: "#7B4FD8",
          magenta: "#8A4EDB",
          dark: "#172033",
          body: "#4B5565",
          muted: "#7A8495",
          border: "#E6EAF2",
          surface: "#FAFBFD",
          alt: "#F7F8FC",
          card: "#FFFFFF",
          success: "#2FA36B",
          accent: "#F59E0B",
        }
      },
      fontFamily: {
        bangla: ["var(--font-bangla)", "'Noto Sans Bengali'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3157D5 0%, #5B55D8 50%, #8A4EDB 100%)",
        "brand-gradient-hover": "linear-gradient(135deg, #2848b8 0%, #4f49c4 50%, #7b3fc9 100%)",
        "brand-subtle": "linear-gradient(135deg, rgba(49, 87, 213, 0.05) 0%, rgba(91, 85, 216, 0.06) 50%, rgba(138, 78, 219, 0.08) 100%)",
        "gemini-glow": "radial-gradient(circle, rgba(123, 79, 216, 0.12) 0%, rgba(49, 87, 213, 0.04) 50%, transparent 80%)",
      },
      boxShadow: {
        "gemini": "0 20px 60px rgba(70, 80, 140, 0.12), 0 4px 16px rgba(49, 87, 213, 0.04)",
        "card-hover": "0 20px 40px rgba(49, 87, 213, 0.10), 0 4px 12px rgba(23, 32, 51, 0.04)",
        "glow": "0 8px 24px rgba(91, 85, 216, 0.32)",
        "soft": "0 2px 10px rgba(23, 32, 51, 0.04)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(1deg)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        }
      },
      animation: {
        float: "float 4.5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
export default config;
