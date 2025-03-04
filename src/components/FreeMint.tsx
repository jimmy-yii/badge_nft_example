import { useState } from "react";
import { kite } from "../kite";
import { useMint } from "../hooks/useMint";
import { useAccount } from "wagmi";
import { FREE_MINT_NFT_ADDRESS } from "../abi";
import { useOwnedNFT } from "../hooks/useOwnedNFT";

export function FreeMint() {
  const { mint, isLoading: isMinting, error: mintError, result: mintResult } = useMint();
  const { address } = useAccount();
  const [badgeAddress, setBadgeAddress] = useState<`0x${string}`>(FREE_MINT_NFT_ADDRESS as `0x${string}`);
  const { ownsNFT: userOwnBadge } = useOwnedNFT(address, badgeAddress);

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-2xl font-bold">Free Mint Badge</h1>
      <div className="flex flex-col space-y-2 w-full">
        <a
          href={`${kite.blockExplorers?.default.url}/address/${badgeAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text underline text-blue-400"
        >
          Badge Address
        </a>
        <div className="flex flex-row items-center justify-center space-x-2 w-full">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={badgeAddress}
            onChange={(e) => {
              setBadgeAddress(e.target.value as `0x${string}`);
            }}
          />

        </div>
        <button
          onClick={() => mint(badgeAddress as `0x${string}`, address as `0x${string}`, [])}
          disabled={isMinting}
          className={`px-4 py-2 rounded-md ${isMinting
            ? "bg-gray-400 cursor-not-allowed"
            : userOwnBadge
              ? "bg-green-500"
              : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
        >
          {isMinting ? "Minting..." : userOwnBadge ? "Already Owned" : "Mint Badge"}
        </button>
      </div>

      <div>
        {mintError && <p className="text-red-500 mt-2">{mintError.message}</p>}
        {mintResult && (
          <a
            href={`${kite.blockExplorers?.default.url}/tx/${mintResult.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 mt-2 underline"
          >
            View on Explorer
          </a>
        )}
      </div>
    </div>
  );
} 