import type {NextConfig} from 'next';
 
const nextConfig: NextConfig = {
  output: 'standalone',
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
    // Use Docker container names in production/Docker environment
    const isDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER === 'true';
    
    const gofrUrl = isDocker 
      ? 'http://gofr-backend:8081'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
    
    const studioUrl = isDocker 
      ? 'http://studio:3001'
      : process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3001';
    
    const blockdagUrl = isDocker 
      ? 'http://blockdag-node:8080'
      : process.env.NEXT_PUBLIC_BLOCKDAG_URL || 'http://localhost:8080';
    
    return [
      {
        source: '/api/gofr/:path*',
        destination: `${gofrUrl}/api/v1/:path*`,
      },
      {
        source: '/api/studio/:path*',
        destination: `${studioUrl}/api/v1/:path*`,
      },
      {
        source: '/api/blockdag/:path*',
        destination: `${blockdagUrl}/api/v1/:path*`,
      },
    ];
  },
};
 
export default nextConfig;
