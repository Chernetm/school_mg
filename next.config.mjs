/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    webpack: (config) => {
    config.resolve.alias['drizzle-orm'] = false; // ✅ ignore drizzle-orm
    return config;
  },
};

export default nextConfig;
