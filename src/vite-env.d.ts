/// <reference types="vite/client" />

// Web3 Window Extensions
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isRabby?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
  solana?: {
    isPhantom?: boolean;
    isSolflare?: boolean;
    connect: () => Promise<{ publicKey: any }>;
    disconnect: () => Promise<void>;
  };
  phantom?: {
    solana?: any;
  };
  // Polyfill globals
  Buffer: typeof Buffer;
  global: typeof globalThis;
  process: NodeJS.Process;
}

// Node.js polyfills for web3
declare module 'crypto-browserify';
declare module 'stream-browserify';
declare module 'process/browser' {
  export default process;
}

// Buffer global
declare const Buffer: typeof import('buffer').Buffer;
declare const process: NodeJS.Process;
declare const global: typeof globalThis;

// Environment Variables (add your own)
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_RPC_URL: string;
  // Add more as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}