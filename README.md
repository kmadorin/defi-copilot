# Starknet DeFi Copilot

A Telegram mini app that simplifies DeFi interactions on Starknet using natural language commands and Argent wallet integration.

## Overview

Starknet DeFi Copilot is a user-friendly interface that allows users to interact with DeFi protocols directly through Telegram. The app features:

- Natural language command processing for DeFi operations
- Seamless integration with Argent wallet
- Token transfers using Telegram usernames or Starknet addresses
- Real-time transaction status updates
- User-friendly interface with dark mode support

## Features

- **Natural Language Commands**: Send tokens using simple commands like "Send 50 USDC to @username" or "Swap 0.004 ETH to USDC"
- **Wallet Integration**: Connect directly to Argent wallet through Telegram
- **Token Support**: Currently supports ETH and STRK tokens on Starknet Sepolia
- **Transaction Management**: Real-time status updates and transaction confirmation flows
- **Address Book**: Map Telegram usernames to Starknet addresses for easier transfers

## Technology Stack

- React + TypeScript + Vite
- Starknet.js for blockchain interactions
- Argent TMA Wallet SDK
- Telegram Mini App SDK
- TailwindCSS for styling
- shadcn/ui components

## Getting Started

1. Clone the repository:

bash
git clone https://github.com/yourusername/defi-copilot.git
cd defi-copilot
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.


## Try It Out

You can try the app at [t.me/defi_copilot_bot/deficopilot](https://t.me/defi_copilot_bot/deficopilot) using [Telegram Test Environment](https://core.telegram.org/bots/webapps#testing-mini-apps).

