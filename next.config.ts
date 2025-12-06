import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds even if there are type errors
    ignoreBuildErrors: true,
  },
  // eslint key removed — use `next lint` manually instead
};

export default nextConfig;
