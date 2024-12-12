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
      height: {
        header: "75px",
        banner: "calc(100% -75px)",
        "header-admin": "80px",
      },
    },
  },
  plugins: [],
} satisfies Config;