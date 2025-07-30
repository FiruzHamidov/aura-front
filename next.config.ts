import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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
