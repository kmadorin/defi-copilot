import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { erc20ABI } from '../lib/abi/erc20.abi';
import Big from 'big.js';
import { Contract, AccountInterface } from 'starknet';

const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

export const SendTransaction = () => {
  const { account } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      if (!recipient || !amount) {
        throw new Error('Please fill in all fields');
      }

      // Create contract instance
      const erc20 = new Contract(erc20ABI, ETH_TOKEN_ADDRESS, account as unknown as AccountInterface);
      
      // Convert amount to wei using Big.js for precise calculation
      const amountInWei = new Big(amount).mul(new Big(10).pow(18));
      
      // Convert to string and remove decimal point for contract interaction
      const amountToTransfer = BigInt(amountInWei.toFixed(0));

      // Create the transfer call
      const transferCall = erc20.populate("transfer", [recipient, amountToTransfer]);

      // Execute the transfer
      const { transaction_hash } = await account.execute([transferCall]);
      
      setSuccess(`Transaction submitted: ${transaction_hash}`);
      
      // Optionally wait for transaction confirmation
      await account.waitForTransaction(transaction_hash);
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Send ETH</h2>
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