/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Registers instrumentation.ts (events + payment-expiry job) on Node server start
    instrumentationHook: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt', 'bcryptjs'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  // Next does not register app/api/packages (folder name conflict). Keep Express path parity via rewrite.
  async rewrites() {
    return [
      {
        source: "/api/packages",
        destination: "/api/product-packages",
      },
      {
        source: "/api/packages/:path*",
        destination: "/api/product-packages/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
