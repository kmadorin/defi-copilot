import { useState, useEffect } from 'react';
import { Account, Contract, RpcProvider, stark } from 'starknet';
import { erc20ABI } from '../lib/abi/erc20.abi';
import Big from 'big.js';

const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const WALLET_STORAGE_KEY = 'starknet_wallet';
const RPC_ENDPOINT = 'https://starknet-sepolia.public.blastapi.io';

interface WalletData {
  privateKey: string;
  address: string;
}

export const SendNativeTransaction = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    try {
      let walletData: WalletData;

      // Try to read existing wallet data from localStorage
      const storedWallet = localStorage.getItem(WALLET_STORAGE_KEY);
      if (storedWallet) {
        walletData = JSON.parse(storedWallet);
      } else {
        // Create new wallet with stark utils
        const privateKey = stark.randomAddress();
        const provider = new RpcProvider({ nodeUrl: RPC_ENDPOINT });
        const newAccount = new Account(provider, ETH_TOKEN_ADDRESS, privateKey);
        
        walletData = {
          privateKey: privateKey,
          address: newAccount.address
        };

        // Save wallet data to localStorage
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(walletData));
      }

      // Initialize account with RPC provider
      const provider = new RpcProvider({ nodeUrl: RPC_ENDPOINT });
      const account = new Account(provider, ETH_TOKEN_ADDRESS, walletData.privateKey);
      setAccount(account);
    } catch (err) {
      console.error('Failed to initialize wallet:', err);
      setError('Failed to initialize wallet');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!account) {
        throw new Error('Wallet not initialized');
      }

      if (!recipient || !amount) {
        throw new Error('Please fill in all fields');
      }

      // Create contract instance
      const erc20 = new Contract(erc20ABI, ETH_TOKEN_ADDRESS, account);
      
      // Convert amount to wei using Big.js for precise calculation
      const amountInWei = new Big(amount).mul(new Big(10).pow(18));
      
      // Convert to string and remove decimal point for contract interaction
      const amountToTransfer = BigInt(amountInWei.toFixed(0));

      // Create the transfer call
      const transferCall = erc20.populate("transfer", [recipient, amountToTransfer]);

      // Execute the transfer
      const { transaction_hash } = await account.execute([transferCall]);
      
      setSuccess(`Transaction submitted: ${transaction_hash}`);
      
      // Wait for transaction confirmation
      await account.waitForTransaction(transaction_hash);
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Send ETH (Local Wallet)</h2>
      {account && (
        <div className="mb-4">
          <p className="text-sm break-all">Wallet Address: {account.address}</p>
        </div>
      )}
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0x..."
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (ETH)
          </label>
          <input
            id="amount"
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.0"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>

        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-2 text-sm text-green-600">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}; 