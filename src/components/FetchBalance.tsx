import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { AccountInterface, Contract } from 'starknet';
import erc20Abi from '../lib/abi/erc20.abi.json';

const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

export const FetchBalance = () => {
  const { account } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchBalance() {
      try {
        if (account) {
          const erc20 = new Contract(erc20Abi, ETH_TOKEN_ADDRESS, account as unknown as AccountInterface);
          const result = await erc20.balanceOf(account.address) as bigint;
          const decimals = 18n;
          const formattedBalance = result / 10n ** decimals; // Adjust the value for decimals using BigInt arithmetic.
          setBalance(Number(formattedBalance)); // Convert the number for display.
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }

    fetchBalance();
  }, [account]);

  if (!account) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">ETH Balance</h2>
      <div className="text-xl">{balance} ETH</div>
    </div>
  );
};