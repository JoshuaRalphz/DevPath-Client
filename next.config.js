/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
})

const nextConfig = {
  images: {
      domains: ['res.cloudinary.com','randomuser.me'],
  },
  experimental:{
      reactRoot: true,
      suppressHydrationWarning: true,
  }
}

module.exports = withPWA({
nextConfig
}); 