/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/favourites',
          destination: '/client/favourites',
        },
      ],
    };
  },
};

module.exports = nextConfig;