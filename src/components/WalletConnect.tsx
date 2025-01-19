import { useWallet } from '../contexts/WalletContext';
import {Address} from './Address';
import { Copy } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { Button } from "@/components/ui/button";

export function WalletConnect() {
  const { account, connect, disconnect, error } = useWallet();
  const copyToClipboard = useCopyToClipboard(account?.address || '');

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (account) {
    return (
      <div className="flex justify-between items-center">
				<div className="flex items-center">
        	<Address className="text-lg text-white" symbols={12} address={account.address} />
					<Button
						onClick={copyToClipboard}
						variant="ghost"
						size="icon"
						className="ml-2 text-gray-400 hover:text-white hover:bg-transparent"
					>
						<Copy className="h-4 w-4" />
					</Button>
				</div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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