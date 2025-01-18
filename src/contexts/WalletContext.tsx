import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import WebApp from '@twa-dev/sdk';
import { ArgentTMA, SessionAccountInterface } from '@argent/tma-wallet';

interface WalletContextType {
  wallet: ArgentTMA | undefined;
  account: SessionAccountInterface | undefined;
  disconnect: () => void;
  connect: () => Promise<void>;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<ArgentTMA>();
  const [account, setAccount] = useState<SessionAccountInterface>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    // Set the main button to expand to full width
    WebApp.requestFullscreen();

    // Initialize Argent TMA
    const argentTMA = ArgentTMA.init({
      appName: "DeFi Copilot",
      appTelegramUrl: "https://t.me/defi_copilot_bot/deficopilot",
      environment: "sepolia",
      sessionParams: {
        allowedMethods: [
          {
            contract: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            selector: "transfer"
          }
        ],
        validityDays: 7
      }
    });

    setWallet(argentTMA);

    // Try to connect if there's an existing session
    argentTMA.connect()
      .then(res => {
        setAccount(res?.account);
      })
      .catch(err => console.log('err', err));
  }, []);

  const connect = async () => {
    if (!wallet) return;
    
    try {
      await wallet.requestConnection({
        callbackData: 'custom_callback',
        approvalRequests: [
          {
            tokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
            amount: BigInt(1000000000000000000).toString(),
            spender: 'spender_address',
          }
        ],
      });
      const res = await wallet.connect();
      setAccount(res?.account);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      console.log(err);
    }
  };

  const disconnect = async () => {
    if (!wallet) return;
    
    try {
      await wallet.clearSession();
      setAccount(undefined);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
      console.log(err);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, account, connect, disconnect, error }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 