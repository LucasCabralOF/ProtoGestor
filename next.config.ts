import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: false,
};

const withNextIntl = createNextIntlPlugin("./src/utils/i18n.ts");
export default withNextIntl(nextConfig);
