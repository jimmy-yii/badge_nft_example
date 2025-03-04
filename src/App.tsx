import { useAccount } from "wagmi";
import { ProofSection } from "./proof";
import { FreeMint } from "./components/FreeMint";
import { ProofMint } from "./components/ProofMint";

function App() {
	const { address } = useAccount();

	return (
		<div className="flex h-screen">
			<div className="w-1/2 p-8 border-r">
				<ProofSection />
			</div>

			<div className="w-1/2 p-8 flex flex-col items-start justify-start space-y-8">
				<h1 className="text-2xl font-bold">Connect Wallet</h1>
				<div className="mb-4">
					{/* @ts-expect-error msg */}
					<appkit-button />
				</div>

				<FreeMint />
				<ProofMint />
			</div>
		</div>
	);
}

export default App;
