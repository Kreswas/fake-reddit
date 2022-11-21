/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  // compiler: {
  //   emotion: true,
  // },
  images: {
    domains: ['www.redditinc.com', 'avatars.dicebear.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dalepnml9/**',
      },
    ],
  },
};
