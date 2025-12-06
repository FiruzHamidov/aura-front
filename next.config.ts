import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.aura.tj",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
