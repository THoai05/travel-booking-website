/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/client/:path*',
      },
    ]
  },
};

module.exports = nextConfig;
