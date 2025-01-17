import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import { ArgentTMA } from '@argent/tma-wallet'
import { WalletConnect } from './components/WalletConnect'

function App() {
  const [wallet, setWallet] = useState<ArgentTMA>()

  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    // Set the main button to expand to full width
    WebApp.requestFullscreen();

    // Initialize Argent TMA
    const argentTMA = ArgentTMA.init({
      appName: "DeFi Copilot",
      appTelegramUrl: "https://t.me/defi_copilot_bot/deficopilot",
      environment: "sepolia",
      sessionParams: {
        allowedMethods: [
          {
            contract: "0x036133c88c1954413150db74c26243e2af77170a4032934b275708d84ec5452f",
            selector: "increment"
          }
        ],
        validityDays: 7
      }
    });

    setWallet(argentTMA);

  }, []);

  return (
    <div className="w-full min-h-screen p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">DeFi Copilot</h1>
      <div className="flex-1 bg-card rounded-lg p-4 shadow-lg flex flex-col gap-4">
        {wallet && <WalletConnect wallet={wallet} />}
        {/* Chat interface will be implemented here */}
      </div>
    </div>
  )
}

export default App
