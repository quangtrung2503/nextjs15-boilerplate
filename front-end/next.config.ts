import { NextConfig } from "next";

const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: `/en`,
        permanent: false,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
