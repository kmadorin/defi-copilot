import React, { useState, KeyboardEvent } from 'react';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  onChange?: () => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.();
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g. 'Send 0.001 ETH to ...'"
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
      />
    </div>
  );
}; 