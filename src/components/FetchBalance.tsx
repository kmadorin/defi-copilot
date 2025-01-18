import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { AccountInterface, Contract } from 'starknet';
import {erc20ABI} from '../lib/abi/erc20.abi';
import Big from 'big.js';

const ETH_TOKEN_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

export const FetchBalance = () => {
  const { account } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchBalance() {
      try {
				console.log('fetchBalance try start')
				console.log('account: ', account?.address)
        if (account?.address) {
          const erc20 = new Contract(erc20ABI, ETH_TOKEN_ADDRESS, account as unknown as AccountInterface);
          const result = await erc20.balanceOf(account?.address) as bigint;
          const decimals = new Big(10).pow(18);
          const formattedBalance = new Big(result.toString()).div(decimals);
          setBalance(Number(formattedBalance.toFixed(5)));
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