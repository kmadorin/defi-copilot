import { useWallet } from '../contexts/WalletContext';

export function WalletConnect() {
  const { wallet, account, connect, disconnect, error } = useWallet();
	
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (account) {
    return (
      <div>
        <h1>Connected</h1>
        <p className="text-sm break-all">Address: {account.address}</p>
        <button
          onClick={disconnect}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (wallet?.isConnected()) {
    return (
      <div>
        <h1>Connected</h1>
        <button
          onClick={disconnect}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  );
} 