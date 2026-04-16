import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  reactCompiler: false,
};

const withNextIntl = createNextIntlPlugin("./src/utils/i18n.ts");
export default withNextIntl(nextConfig);
