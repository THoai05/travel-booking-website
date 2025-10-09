/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'], 
<<<<<<< HEAD
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
=======
>>>>>>> f0c50b0f07d835a094929dc90a652e0cd8e1d3db
  },
};

module.exports = nextConfig;