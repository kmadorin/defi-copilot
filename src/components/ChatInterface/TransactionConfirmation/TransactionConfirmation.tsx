import React from 'react';
import { Address } from '../../Address';

interface ParsedSendCommand {
  type: 'SEND';
  amount: string;
  token: string;
  recipient: string;
}

interface TransactionConfirmationProps {
  command: ParsedSendCommand;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  command,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-white">Confirm Send</h3>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount:</span>
            <span className="text-white">{command.amount} {command.token}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">To:</span>
            <Address address={command.recipient} symbols={11} className="text-white font-mono"/>
          </div>
        </div>

        <div className="text-yellow-500 text-sm">
          ⚠️ Please verify the address. Transactions cannot be reversed.
        </div>

        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}; 