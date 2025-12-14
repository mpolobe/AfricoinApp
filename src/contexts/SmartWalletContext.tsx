import { createContext, useContext, ReactNode, useMemo, useCallback, useState, useEffect } from 'react';
import { useUser, useSmartAccountClient, useLogout, useAccount } from '@account-kit/react';
import { type Address } from 'viem';
import { getEthBalance, getTokenBalances, getTokenMetadata, formatTokenBalance } from '@/lib/tokenService';
import { useFirebase } from './FirebaseContext'; // Imports db, userId, appId
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  Firestore,
  serverTimestamp 
} from 'firebase/firestore';

// Define the transaction structure used for both state and Firestore
export interface Transaction {
  id: string; // Document ID
  type: 'send' | 'receive';
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: Date | { seconds: number, nanoseconds: number }; // Handle Firestore timestamp format
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  createdAt: any; // Firestore timestamp object for sorting
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
}

interface SmartWalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isLoadingBalances: boolean;
  balance: string;
  tokens: TokenBalance[];
  transactions: Transaction[];
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'status' | 'txHash' | 'createdAt'>, txHash: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  client: ReturnType<typeof useSmartAccountClient>['client'];
}

const SmartWalletContext = createContext<SmartWalletContextType | undefined>(undefined);

// Helper function to convert Firestore timestamp back to JavaScript Date (or leave as is if not yet converted)
const parseTimestamp = (ts: any): Date => {
  if (ts instanceof Date) return ts;
  if (ts && ts.seconds) return new Date(ts.seconds * 1000);
  return new Date();
};


export function SmartWalletProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { address, isConnected, isConnecting } = useAccount();
  const { client } = useSmartAccountClient();
  const { logout } = useLogout();

  // Use Firebase context to get necessary services and IDs
  const { db, userId, appId, isReady: isFirebaseReady } = useFirebase();

  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Function to get the correct Firestore collection path for user's private data
  const getTransactionCollection = useCallback((firestore: Firestore) => {
    if (!userId || !appId) throw new Error("Firebase or User ID not ready.");
    // Private data path: /artifacts/{appId}/users/{userId}/transactions
    return collection(firestore, `artifacts/${appId}/users/${userId}/transactions`);
  }, [userId, appId]);


  // 1. ADD TRANSACTION (Firestore Implementation)
  const addTransaction = useCallback(async (
    tx: Omit<Transaction, 'id' | 'timestamp' | 'status' | 'txHash' | 'createdAt'>, 
    txHash: string
  ) => {
    if (!db) {
      console.error("Firestore not initialized.");
      return;
    }
    
    // Structure the data for saving to Firestore
    const transactionData = {
      ...tx,
      status: 'pending', 
      txHash,
      // Use serverTimestamp for reliable ordering and creation time
      createdAt: serverTimestamp(), 
    };

    try {
      // addDoc creates a new document with an auto-generated ID
      const docRef = await addDoc(getTransactionCollection(db), transactionData);
      console.log("Transaction added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding transaction to Firestore:", error);
    }
    
  }, [db, getTransactionCollection]);

  // 2. UPDATE TRANSACTION (Firestore Implementation)
  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (!db) {
      console.error("Firestore not initialized.");
      return;
    }

    try {
      const docRef = doc(getTransactionCollection(db), id);
      // Filter out non-Firestore-safe fields (like local 'id' or converted 'timestamp')
      const updatesToSend = Object.fromEntries(
          Object.entries(updates).filter(([key, value]) => key !== 'id' && key !== 'timestamp')
      );
      await updateDoc(docRef, updatesToSend);
      console.log("Transaction updated with ID: ", id);
    } catch (error) {
      console.error("Error updating transaction in Firestore:", error);
    }
  }, [db, getTransactionCollection]);


  // 3. LISTEN FOR TRANSACTIONS (onSnapshot Implementation)
  useEffect(() => {
    // Only proceed if Firebase is ready AND the user is connected (has an address)
    if (!isFirebaseReady || !db || !userId || !isConnected) return;

    // Create a simple query to fetch the user's transaction data
    // We fetch all documents in the user's private transaction collection.
    const txQuery = query(getTransactionCollection(db));

    const unsubscribe = onSnapshot(txQuery, (snapshot) => {
      const fetchedTransactions: Transaction[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Transaction, 'id'> & { timestamp?: any, createdAt?: any };
        
        // Convert Firestore timestamp to JS Date for consistent use in the app
        const transactionDate = parseTimestamp(data.createdAt || new Date());
        
        fetchedTransactions.push({
          id: doc.id,
          ...data,
          timestamp: transactionDate, // Use the JS Date object
        } as Transaction);
      });
      
      // Sort in-memory by creation time (descending: newest first)
      fetchedTransactions.sort((a, b) => {
        const dateA = parseTimestamp(a.timestamp);
        const dateB = parseTimestamp(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });

      setTransactions(fetchedTransactions);
      console.log(`Fetched ${fetchedTransactions.length} transactions from Firestore.`);
    }, (error) => {
      console.error("Error listening to transactions:", error);
    });

    // Clean up the listener when the component unmounts or dependencies change
    return () => unsubscribe();
  }, [isFirebaseReady, db, userId, isConnected, getTransactionCollection]);


  // Balance fetching logic
  const fetchBalances = useCallback(async () => {
    if (!address) return;

    setIsLoadingBalances(true);
    try {
      const ethBalance = await getEthBalance(address as Address);
      
      const ethToken: TokenBalance = {
        symbol: 'ETH', name: 'Ethereum',
        balance: ethBalance,
        // USD value calculation is mocked until a price API is integrated.
        usdValue: '0.00', icon: 'ETH' 
      };

      const rawTokens = await getTokenBalances(address);
      const erc20Tokens: TokenBalance[] = [];

      // A simple mock list of supported tokens on Sepolia (replace with real supported tokens)
      const supportedTokens: { [key: string]: string } = {
        '0x1f9840a85d5af5bf1d1762f925bdadc4201f9845': 'UNI' // Placeholder address
      };
      
      for (const token of rawTokens) {
        if (token.tokenBalance === '0x0') continue;
        
        const contractAddress = token.contractAddress.toLowerCase();
        
        if (contractAddress !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' && supportedTokens[contractAddress]) {
          const metadata = await getTokenMetadata(token.contractAddress);
          if (!metadata) continue;

          const balance = formatTokenBalance(token.tokenBalance, metadata.decimals);
          
          erc20Tokens.push({
            symbol: metadata.symbol || 'UNK', name: metadata.name || 'Unknown',
            balance, usdValue: '0.00', icon: metadata.symbol || 'UNK'
          });
        }
      }
      setTokens([ethToken, ...erc20Tokens]);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally { setIsLoadingBalances(false); }
  }, [address]);


  // Effect to manage balance fetching on connection change
  useEffect(() => { 
    if (isConnected) {
      fetchBalances(); 
    } else {
      // Clear state on disconnect
      setTokens([]);
      setTransactions([]);
      setIsLoadingBalances(false);
    }
  }, [isConnected, fetchBalances]);

  const balance = useMemo(() => {
    if (!isConnected || tokens.length === 0) return '0.00';
    // This calculation sums up the USD values (currently mocked as '0.00')
    return tokens.reduce((sum, t) => sum + parseFloat(t.usdValue.replace(/,/g, '') || '0'), 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2 });
  }, [isConnected, tokens]);

  const disconnect = useCallback(() => { logout(); }, [logout]);

  const value = useMemo(() => ({
    address, isConnected, isConnecting, isLoadingBalances, balance, tokens, transactions,
    disconnect, refreshBalances: fetchBalances, addTransaction, updateTransaction, client
  }), [address, isConnected, isConnecting, isLoadingBalances, balance, tokens, transactions, disconnect, fetchBalances, addTransaction, updateTransaction, client]);

  return <SmartWalletContext.Provider value={value}>{children}</SmartWalletContext.Provider>;
}

export const useSmartWallet = () => {
  const context = useContext(SmartWalletContext);
  if (!context) throw new Error('useSmartWallet must be used within SmartWalletProvider');
  return context;
};


