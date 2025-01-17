import { useCallback, useEffect, useState } from 'react';
import { ArgentTMA } from '@argent/tma-wallet';
import type { SessionAccountInterface } from '@argent/tma-wallet';

interface WalletConnectProps {
  wallet: ArgentTMA;
}

export function WalletConnect({ wallet }: WalletConnectProps) {
  const [account, setAccount] = useState<SessionAccountInterface>();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    try {
			console.log("wallet", wallet)

      const connection = await wallet.connect();

      if (connection?.account) {
        setAccount(connection.account);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
			console.log(err)
    }
  }, [wallet]);

  useEffect(() => {
    // Only set account if already connected
    if (wallet.isConnected() && wallet.sessionAccount) {
      setAccount(wallet.sessionAccount);
    }
  }, [wallet]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (account) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">Wallet Connected</h2>
        <p className="text-sm break-all">Address: {account.address}</p>
      </div>
    );
  }

	if (wallet.isConnected()) {
		return (<h1>Connected</h1>)
	}

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  );
} 