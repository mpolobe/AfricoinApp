/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for S3
  trailingSlash: true, // Better S3 compatibility
  images: {
    unoptimized: true, // Required for static export
  },
  // Handle web3 polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
      };
    }
    return config;
  },
}

module.exports = nextConfig