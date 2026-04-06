/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.pinet.com https://*.minepi.com https://apppiworkcfacbda4498.pinet.com;",
          },
        ],
      },
    ];
  },
}

export default nextConfig;