/// <reference types="vite/client" />

// Global type augmentations for web3
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isRabby?: boolean;
      isTrust?: boolean;
      isBraveWallet?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      chainId: string;
      selectedAddress: string | null;
    };
    solana?: {
      isPhantom?: boolean;
      isSolflare?: boolean;
      isBackpack?: boolean;
      publicKey?: { toString: () => string };
      connect: () => Promise<{ publicKey: any }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    };
    phantom?: {
      solana?: any;
    };
    // Buffer polyfill
    Buffer: typeof Buffer;
    // Node.js globals
    process: NodeJS.Process;
    global: typeof globalThis;
  }
  
  // Declare Node.js globals for browser
  const Buffer: typeof import('buffer').Buffer;
  const process: NodeJS.Process;
  const global: typeof globalThis;
}

// Module declarations
declare module 'crypto-browserify';
declare module 'stream-browserify';
declare module 'process/browser' {
  export default process;
}
declare module 'util/';
declare module 'events/';
declare module 'assert/';
declare module 'string_decoder/';

// Image formats
declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}
declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.svg' {
  const value: string;
  export default value;
}
declare module '*.gif' {
  const value: string;
  export default value;
}
declare module '*.webp' {
  const value: string;
  export default value;
}