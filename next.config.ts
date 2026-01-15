import type {NextConfig} from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Generate unique build ID to force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbopack: {},
  // Force dynamic rendering for virtual labs to prevent stale cache
  experimental: {
    staleTimes: {
      dynamic: 0, // Don't cache dynamic pages
      static: 180, // Cache static pages for 3 minutes only
    },
  },
  // Add cache-control headers for virtual labs
  async headers() {
    return [
      {
        source: '/virtual-labs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  // Include custom service worker logic
  sw: 'sw.js',
  // Add custom service worker handlers
  additionalManifestEntries: [],
  // Exclude virtual labs from caching - always fetch fresh
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\/virtual-labs.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'virtual-labs',
        expiration: {
          maxEntries: 0, // Don't cache
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
} as unknown as any)(nextConfig);
