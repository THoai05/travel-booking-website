/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'example.com', 'localhost'],
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
