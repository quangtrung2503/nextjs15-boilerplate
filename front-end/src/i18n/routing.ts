import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/pathnames": {
      en: "/pathnames",
      vi: "/pathnames",
    },
  },
  localeDetection: false
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number] | [string];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
