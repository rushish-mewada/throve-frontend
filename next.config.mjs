/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.101', 'localhost', '10.233.51.55'],
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    taint: true,
    serverActions: {
      allowedOrigins: ['192.168.0.101', 'localhost', 'http://localhost'],
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/account/login',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/women',
        destination: '/collections/women',
      },
      {
        source: '/men',
        destination: '/collections/men',
      },
      {
        source: '/sale',
        destination: '/collections/sale',
      },
      {
        source: '/new-arrival',
        destination: '/collections/new-arrivals',
      },
      {
        source: '/new-arrivals',
        destination: '/collections/new-arrivals',
      },
      {
        source: '/terms',
        destination: '/policies/terms',
      },
      {
        source: '/privacy',
        destination: '/policies/privacy',
      },
      {
        source: '/returns',
        destination: '/policies/returns',
      },
      {
        source: '/shipping',
        destination: '/policies/shipping',
      },
      {
        source: '/cookies',
        destination: '/policies/cookies',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
        ]
      }
    ];
  }
};

export default nextConfig;
