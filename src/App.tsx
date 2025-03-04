import { useEffect, useState } from "react";
import { WALLET_ADDRESS, NFT_ADDRESS, abi } from "./abi";
import { formatEther } from "viem";
import { kite, client } from "./kite";
import { useMint } from "./hooks/useMint";
import { useAccount, useWalletClient } from "wagmi";
function App() {
	const { mint, isLoading: isMinting, error: mintError, result: mintResult } = useMint();

	const { address } = useAccount();

	const walletClient = useWalletClient();

	const [badgeAddress, setBadgeAddress] = useState<`0x${string}`>(NFT_ADDRESS as `0x${string}`)

	const [userOwnBadge, setUserOwnBadge] = useState(false)

	useEffect(() => {
		if (!address) {
			return;
		}
		client.readContract({
			address: badgeAddress,
			abi: abi,
			functionName: "balanceOf",
			args: [address]
		}).then((balance) => {
			setUserOwnBadge(balance > 0n)
		}).catch((error) => {
			console.error("Error checking badge ownership:", error);
		})
	}, [address])

	return (
		<div className="App">
			<div className="flex flex-col items-center justify-center h-screen w-[1000px] mx-auto">
				<div className="mb-4">
				{/* @ts-expect-error msg */}
				<appkit-button />
				</div>

				<div className="mt-4 flex flex-row items-center justify-center mb-4">
					<a href={`${kite.blockExplorers?.default.url}/address/${badgeAddress}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold mr-4 underline text-blue-400">Badge Address</a>
					<input type="text" className="w-[500px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
						value={badgeAddress}
						onChange={(e) => {
							setBadgeAddress(e.target.value as `0x${string}`);
						}}
					/>
				</div>
			
				<div>
					<button 
						onClick={() => mint(address as `0x${string}`, [])}
						disabled={isMinting}
						className={`px-4 py-2 rounded-md ${
							isMinting
								? "bg-gray-400 cursor-not-allowed"
								: userOwnBadge
								? "bg-green-500"
								: "bg-blue-500 hover:bg-blue-600"
						} text-white`}
					>
						{isMinting ? "Minting..." : userOwnBadge ? "Already Owned" : "Mint Badge"}
					</button>
					{mintError && (
						<p className="text-red-500 mt-2">{mintError.message}</p>
					)}
					{mintResult && (
						<a href={`${kite.blockExplorers?.default.url}/tx/${mintResult.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 mt-2 underline">View on Explorer</a>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
