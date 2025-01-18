import React, { useState, useEffect } from 'react';
import { CommandInput } from './CommandInput';
import { ResponseBlock } from './ResponseBlock';
import { TransactionConfirmation } from './TransactionConfirmation';
import { parseSendCommand, SUPPORTED_TOKENS } from '../../utils/commandParser';
import { useWallet } from '../../contexts/WalletContext';
import { Contract, AccountInterface } from 'starknet';
import { erc20ABI } from '../../lib/abi/erc20.abi';
import Big from 'big.js';

interface ParsedSendCommand {
  type: 'SEND';
  amount: string;
  token: string;
  recipient: string;
}

type TransactionStatus = 'idle' | 'confirming' | 'processing' | 'completed' | 'error';

export const ChatInterface: React.FC = () => {
  const { account, connect, wallet } = useWallet();
  const [parsedCommand, setParsedCommand] = useState<ParsedSendCommand | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string>();
  const [showBlocks, setShowBlocks] = useState(false);

  // Reset all states when wallet is disconnected
  useEffect(() => {
    if (!wallet?.isConnected()) {
      setParsedCommand(null);
      setTransactionStatus('idle');
      setError(undefined);
      setTxHash(undefined);
      setShowBlocks(false);
    }
  }, [wallet]);

  const handleCommandSubmit = (input: string) => {
    try {
      const parsed = parseSendCommand(input);
      if (parsed) {
        setParsedCommand(parsed);
        setTransactionStatus('confirming');
        setError(undefined);
        setShowBlocks(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid command format');
      setTransactionStatus('error');
      setShowBlocks(true);
    }
  };

  const handleInputChange = () => {
    // Only hide the blocks when typing, don't reset other states
    setShowBlocks(false);
  };

  const handleConfirmTransaction = async () => {
    if (!parsedCommand) return;

    try {
      setTransactionStatus('processing');
      
      // Connect to wallet if not connected
      if (!account) {
        await connect();
      }

      if (!account) {
        throw new Error('Failed to connect to wallet');
      }

      const tokenConfig = SUPPORTED_TOKENS[parsedCommand.token as keyof typeof SUPPORTED_TOKENS];
      
      // Create contract instance
      const erc20 = new Contract(
        erc20ABI,
        tokenConfig.address,
        account as unknown as AccountInterface
      );

      // Convert amount to wei using Big.js for precise calculation
      const amountInWei = new Big(parsedCommand.amount).mul(new Big(10).pow(tokenConfig.decimals));
      
      // Convert to string and remove decimal point for contract interaction
      const amountToTransfer = BigInt(amountInWei.toFixed(0));

      // Create the transfer call
      const transferCall = erc20.populate("transfer", [parsedCommand.recipient, amountToTransfer]);

      // Execute the transfer
      const { transaction_hash } = await account.execute([transferCall]);
      setTxHash(transaction_hash);
      
      // Wait for transaction confirmation
      await account.waitForTransaction(transaction_hash);
      
      setTransactionStatus('completed');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setTransactionStatus('error');
    }
  };

  const handleCancelTransaction = () => {
    setParsedCommand(null);
    setTransactionStatus('idle');
    setError(undefined);
    setTxHash(undefined);
    setShowBlocks(false);
  };

  // Don't render anything if wallet is not connected
  if (!wallet?.isConnected()) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <CommandInput 
        onSubmit={handleCommandSubmit}
        onChange={handleInputChange}
      />
      {showBlocks && (
        <>
          {(transactionStatus !== 'idle' || error) && (
            <ResponseBlock
              command={parsedCommand}
              status={transactionStatus}
              error={error}
              txHash={txHash}
            />
          )}
          
          {transactionStatus === 'confirming' && parsedCommand && (
            <TransactionConfirmation
              command={parsedCommand}
              onConfirm={handleConfirmTransaction}
              onCancel={handleCancelTransaction}
            />
          )}
        </>
      )}
    </div>
  );
}; 