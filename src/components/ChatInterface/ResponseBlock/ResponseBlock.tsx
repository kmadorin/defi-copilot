import React from 'react';

interface ParsedSendCommand {
  type: 'SEND';
  amount: string;
  token: string;
  recipient: string;
}

interface ResponseBlockProps {
  command: ParsedSendCommand | null;
  status: 'idle' | 'confirming' | 'processing' | 'completed' | 'error';
  error?: string;
  txHash?: string;
}

export const ResponseBlock: React.FC<ResponseBlockProps> = ({ command, status, error, txHash }) => {
  if (!command && status === 'idle') return null;

  const getStatusMessage = () => {
    switch (status) {
      case 'confirming':
        return `Please confirm sending ${command?.amount} ${command?.token} to ${command?.recipient}`;
      case 'processing':
        return txHash 
          ? `Processing transaction... Hash: ${txHash}`
          : 'Processing transaction...';
      case 'completed':
        return txHash 
          ? `Transaction completed successfully! Hash: ${txHash}`
          : 'Transaction completed successfully!';
      case 'error':
        return error || 'Transaction failed. Please try again.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <p className={getStatusColor()}>{getStatusMessage()}</p>
    </div>
  );
}; 