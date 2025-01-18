import { WalletProvider } from './contexts/WalletContext';
import { WalletConnect } from './components/WalletConnect';
import { SendTransaction } from './components/SendTransaction';
import { FetchBalance } from './components/FetchBalance';
import { ChatInterface } from './components/ChatInterface';

function App() {
	return (
		<WalletProvider>
			<div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
				<div className="w-full max-w-4xl mx-auto p-4">
					<WalletConnect />
					<div className="backdrop-blur-xl bg-black/30 rounded-2xl border border-gray-800 shadow-2xl p-8 relative">
						<h1 className="text-2xl font-bold text-center text-white mb-6">Starknet DEFI Copilot</h1>
						<div className="flex-1 flex flex-col gap-4">
							<ChatInterface />
						</div>
					</div>
				</div>
			</div>
		</WalletProvider >
	);
}

export default App;
