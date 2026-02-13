import type {NextConfig} from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Generate unique build ID using git commit hash for cache invalidation
  generateBuildId: async () => {
    // Use git commit hash if available, fallback to timestamp
    try {
      const { execSync } = require('child_process');
      const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
      return `v${commitHash}-${Date.now()}`;
    } catch {
      return `build-${Date.now()}`;
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wisdomwarehouseuae.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    // Allow unoptimized images from all domains (for development)
    unoptimized: process.env.NODE_ENV === 'development',
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
  disable: false, // Enable PWA in development for testing (was: process.env.NODE_ENV === 'development')
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  // Include custom service worker logic
  sw: 'sw.js',
  // Add custom service worker handlers
  additionalManifestEntries: [],
  // Force cache version bump to invalidate all caches
  buildId: `v${Date.now()}`,
  // Aggressive cache invalidation
  cacheStartUrl: false,
  dynamicStartUrl: true,
  cacheOnFrontEndNav: false,
  // Exclude virtual labs from caching - NEVER cache
  runtimeCaching: [
    {
      urlPattern: /\/virtual-labs/,
      handler: 'NetworkOnly', // Changed from NetworkFirst to NetworkOnly - never cache
    },
    {
      urlPattern: /\/_next\/static\/chunks\/app\/.*virtual-labs/,
      handler: 'NetworkOnly', // Don't cache virtual lab chunks
    },
  ],
} as unknown as any)(nextConfig);
