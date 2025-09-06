import type {NextConfig} from 'next';
 
const nextConfig: NextConfig = {
  env: {
    VERBWIRE_API_KEY: process.env.VERBWIRE_API_KEY,
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/gofr/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/v1/:path*`,
      },
      {
        source: '/api/studio/:path*',
        destination: `${process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3001'}/api/v1/:path*`,
      },
      {
        source: '/api/blockdag/:path*',
        destination: `${process.env.NEXT_PUBLIC_BLOCKDAG_URL || 'http://localhost:8080'}/api/v1/:path*`,
      },
    ];
  },
};
 
export default nextConfig;
