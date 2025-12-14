import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
      include: [
        'buffer',
        'crypto',
        'stream',
        'util',
        'events',
        'assert',
        'url',
        'punycode',
        'querystring',
        'path',
        'http',
        'https',
        'os',
        'zlib'
      ],
      exclude: ['fs'],
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Web3 polyfills - more explicit
      'buffer': resolve(__dirname, 'node_modules/buffer/'),
      'stream': resolve(__dirname, 'node_modules/stream-browserify'),
      'crypto': resolve(__dirname, 'node_modules/crypto-browserify'),
      'process': resolve(__dirname, 'node_modules/process/browser'),
      // Add these for better web3 compatibility
      'util': resolve(__dirname, 'node_modules/util/'),
      'events': resolve(__dirname, 'node_modules/events/'),
      'string_decoder': resolve(__dirname, 'node_modules/string_decoder/'),
      'assert': resolve(__dirname, 'node_modules/assert/'),
    },
  },
  
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.version': JSON.stringify('v18.0.0'),
    'process.browser': true,
    'Buffer.isBuffer': 'undefined',
  },
  
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false, // Disable in production for better performance
    rollupOptions: {
      external: [], // Add any packages you want to exclude from bundle
      output: {
        manualChunks: (id) => {
          // More granular chunk splitting
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@solana')) {
              return 'solana-vendor'
            }
            if (id.includes('ethers') || id.includes('viem') || id.includes('wagmi')) {
              return 'evm-vendor'
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor'
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor'
            }
            if (id.includes('@account-kit') || id.includes('@base-org/account')) {
              return 'account-vendor'
            }
            // Default vendor chunk
            return 'vendor'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: true,
    cssCodeSplit: true,
    cssTarget: 'es2020',
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'buffer',
      'process',
      'crypto-browserify',
      'stream-browserify',
      'util',
      'events',
      // Web3 deps that benefit from pre-bundling
      '@solana/web3.js',
      '@solana/wallet-adapter-react',
      'ethers',
      'viem',
      'wagmi',
      '@tanstack/react-query',
    ],
    exclude: [
      '@solana/wallet-adapter-wallets', // Has many dynamic imports
    ],
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis',
      },
      supported: {
        'top-level-await': true,
      },
      plugins: [],
    },
  },
  
  server: {
    port: 3000,
    host: true,
    open: '/', // Open root path
    hmr: {
      overlay: true,
    },
    fs: {
      strict: false, // Allow serving files outside root
    },
    proxy: {
      // Add API proxies if needed
      // '/api': {
      //   target: 'http://localhost:3001',
      //   changeOrigin: true,
      // },
    },
  },
  
  preview: {
    port: 4173,
    host: true,
  },
  
  // Environment-specific config
  envPrefix: ['VITE_', 'PUBLIC_'], // Environment variables prefix
  
  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
  },
})