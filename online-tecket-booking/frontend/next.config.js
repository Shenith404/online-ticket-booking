/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  env: {
    NEXT_PUBLIC_AUTH_SERVICE_URL:
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001",
    NEXT_PUBLIC_EVENT_SERVICE_URL:
      process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || "http://localhost:3002",
    NEXT_PUBLIC_BOOKING_SERVICE_URL:
      process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL || "http://localhost:3003",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
