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
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        primary_100: "var(--primary-100)",
        secondary: "var(--secondary)",
        secondary_100: "var(--secondary-100)",
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
        header_admin: "80px",
      },
      margin: {
        "content-admin": "273px",
        header: "75px",
        "header-admin": "80px",
      },
      width: {
        sidebar: "273px",
        "content-admin": "calc(100% - 273px)",
      },
    },
  },
  plugins: [],
} satisfies Config;