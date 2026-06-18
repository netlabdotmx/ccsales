import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ccsales.netlab.mx", pathname: "/web/image/**" },
      { protocol: "https", hostname: "**.ccsales.com.mx", pathname: "/web/image/**" },
      { protocol: "https", hostname: "**.odoo.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
