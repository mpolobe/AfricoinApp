import { createPublicClient, http, formatEther, type Address } from 'viem';
import { sepolia } from 'viem/chains';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || 'demo-api-key';
// Ensure a default is present or RPC will fail.
const ALCHEMY_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

// Create a Viem public client for standard RPC calls (like getEthBalance)
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(ALCHEMY_RPC_URL),
});

// --- Type Definitions ---
export interface TokenBalanceResult {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
  contractAddress?: string;
  decimals?: number;
}

interface AlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

interface AlchemyTokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
}
// --- End Type Definitions ---


// Fetches the native ETH balance using viem public client
export async function getEthBalance(address: Address): Promise<string> {
  try {
    const balance = await publicClient.getBalance({ address });
    return formatEther(balance);
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return '0';
  }
}

// Fetches all ERC-20 token balances for an address using Alchemy's enhanced API
export async function getTokenBalances(address: string): Promise<AlchemyTokenBalance[]> {
  if (ALCHEMY_API_KEY === 'demo-api-key') {
    console.warn("Using demo API key. Token balances may be mocked or unavailable.");
  }
  try {
    const response = await fetch(ALCHEMY_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address, 'erc20'], // Requesting only ERC-20 tokens
        id: 1,
      }),
    });
    const data = await response.json();
    
    // Check for RPC error response
    if (data.error) {
      console.error('Alchemy RPC Error (getTokenBalances):', data.error);
      return [];
    }
    
    return data.result?.tokenBalances || [];
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
}

// Fetches metadata (name, symbol, decimals) for a token contract
export async function getTokenMetadata(contractAddress: string): Promise<AlchemyTokenMetadata | null> {
  if (ALCHEMY_API_KEY === 'demo-api-key') {
    console.warn("Using demo API key. Token metadata may be mocked or unavailable.");
  }
  try {
    const response = await fetch(ALCHEMY_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenMetadata',
        params: [contractAddress],
        id: 1,
      }),
    });
    const data = await response.json();
    
    // Check for RPC error response
    if (data.error) {
      console.error('Alchemy RPC Error (getTokenMetadata):', data.error);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

// Helper to convert raw BigInt balance to a readable string based on token decimals
export function formatTokenBalance(rawBalance: string, decimals: number): string {
  if (!rawBalance || rawBalance === '0x0') return '0';
  const balance = BigInt(rawBalance);
  const divisor = BigInt(10 ** decimals);
  const intPart = (balance / divisor).toString();
  
  // Calculate the fractional part (up to 4 digits for display)
  let fracPart = (balance % divisor).toString().padStart(decimals, '0');
  fracPart = fracPart.slice(0, 4); 

  // Remove trailing zeros from the fractional part
  fracPart = fracPart.replace(/0+$/, '');

  if (fracPart) {
      return `${intPart}.${fracPart}`;
  }
  return intPart;
}



