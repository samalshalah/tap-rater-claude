import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "taprater.com",
        pathname: "/wp-content/uploads/**"
      }
    ]
  },
  async redirects() {
    return [
      { source: "/product-category/:slug*", destination: "/shop", permanent: true },
      { source: "/my-account", destination: "/admin", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: false }
    ];
  }
};

export default nextConfig;
