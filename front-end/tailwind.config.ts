import type { Config } from "tailwindcss";

export default {
  corePlugins: {
    preflight: false,
  },
  // important: '#_next',
  prefix: 'tw-',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        volkhov: ['Volkhov', 'serif'],
        mulish: ['Mulish', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        primary_light: "var(--primary-light)",
        secondary: "var(--secondary)",
        accent_purple: "var(--accent-purple)",
        accent_blue: "var(--accent-blue)",
        accent_red: "var(--accent-red)",

        accent_gray_dark: "var(--accent-gray-dark)",
        accent_gray_800: "var(--accent-gray-800)",
        accent_gray_500: "var(--accent-gray-500)",
        accent_gray_light: "var(--accent-gray-light)",

        footer: "var(--footer)",
        footer_bottom: "var(--footer-bottom)",
      },
      height: {
        header: "var(--header-height)",
      },
      boxShadow: {
        direction_carousel: "0px 8px 20px 0px #FFDA3280"
      },
      scrollbar: {
        hide: {
          '::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge, and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;