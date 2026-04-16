import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  reactCompiler: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 300,
        ignored: ["**/.git/**", "**/node_modules/**"],
        poll: 1000,
      };
    }

    return config;
  },
};

const withNextIntl = createNextIntlPlugin("./src/utils/i18n.ts");
export default withNextIntl(nextConfig);
