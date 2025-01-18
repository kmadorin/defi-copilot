import telegramMapping from './telegramMapping.json';

interface ParsedSendCommand {
  type: 'SEND';
  amount: string;
  token: string;
  recipient: string;
}

// Supported tokens configuration
export const SUPPORTED_TOKENS = {
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
  },
  STRK: {
    symbol: 'STRK',
    decimals: 18,
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d'
  }
} as const;

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateAddress = (address: string): boolean => {
  // Basic Starknet address validation
  return /^0x[0-9a-fA-F]{1,64}$/.test(address);
};

export const resolveTelegramHandle = (handle: string): string | null => {
  // Look up the handle in our mapping
  const address = (telegramMapping as Record<string, string>)[handle];
  return address || null;
};

export const parseSendCommand = (input: string): ParsedSendCommand | null => {
  // Match pattern: "Send <amount> <token> to <recipient>"
  const pattern = /^send\s+(\d*\.?\d+)\s+(ETH|STRK)\s+to\s+(.+)$/i;
  const match = input.match(pattern);

  if (!match) return null;

  const [, amount, token, recipient] = match;
  const upperToken = token.toUpperCase() as keyof typeof SUPPORTED_TOKENS;

  if (!SUPPORTED_TOKENS[upperToken]) return null;
  if (!validateAmount(amount)) return null;

  // Check if recipient is a Telegram handle or address
  const resolvedRecipient = recipient.startsWith('@') 
    ? resolveTelegramHandle(recipient)
    : recipient;

  if (!resolvedRecipient) {
    throw new Error('Recipient\'s username is not connected to any address. Please try with different username or address.');
  }

  if (!validateAddress(resolvedRecipient)) {
    throw new Error('Invalid recipient address format.');
  }

  return {
    type: 'SEND',
    amount,
    token: upperToken,
    recipient: resolvedRecipient
  };
}; 