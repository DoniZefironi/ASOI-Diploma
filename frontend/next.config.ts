// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'linchakin.com',
        port: '',
        pathname: '/**', // Разрешает все пути на этом хосте
      },
      // Добавляем новый домен для Google Images
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**', // Разрешает все пути на этом хосте
      },
      // Если у вас есть другие внешние домены для изображений, добавьте их сюда
      // {
      //   protocol: 'https',
      //   hostname: 'another-domain.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
  // ... другие настройки
};

module.exports = nextConfig;