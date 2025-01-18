import { WalletProvider } from './contexts/WalletContext';
import { WalletConnect } from './components/WalletConnect';
import { SendTransaction } from './components/SendTransaction';
import { FetchBalance } from './components/FetchBalance';

function App() {
  return (
    <WalletProvider>
      <div className="w-full min-h-screen p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">DeFi Copilot</h1>
        <div className="flex-1 bg-card rounded-lg p-4 shadow-lg flex flex-col gap-4">
          <WalletConnect />
          <FetchBalance />
          <SendTransaction />
          {/* Chat interface will be implemented here */}
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
