/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
      { hostname: 'moneylion.com' },
    ],
  },
};

export default nextConfig;
