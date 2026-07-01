import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',

  // ============================================
  // Image Optimization
  // ============================================
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment' as const,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ============================================
  // Compression & Performance
  // ============================================
  compress: true,
  poweredByHeader: false,

  // ============================================
  // Bundle Optimization
  // ============================================
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'zustand',
    ],
  },
};

export default nextConfig;
