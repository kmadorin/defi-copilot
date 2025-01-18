import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

export const SendTransaction = () => {
  const { account } = useWallet();

	console.log('account: ',account)
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

    if (!account) {
      setError('Wallet not connected');
      setLoading(false);
      return;
    }

    if (!recipient || !amount) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const amountInWei = BigInt(parseFloat(amount) * Math.pow(10, 18)).toString();

		// transfer
    account.execute({
      contractAddress: ETH_TOKEN_ADDRESS,
      entrypoint: 'transfer',
      calldata: [recipient, amountInWei, '0'],
    }).then(res => {
			console.log(res)
			setSuccess(`Transaction submitted: ${res.transaction_hash}`);
   		setLoading(false);
		}).catch(err => {
			console.log(err)
			setError('Transaction failed');
			setLoading(false);
		});
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