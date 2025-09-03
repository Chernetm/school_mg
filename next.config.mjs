

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: (config) => {
    config.resolve.alias['drizzle-orm'] = false;
    return config;
  },
};

export default nextConfig
