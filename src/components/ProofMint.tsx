import { useRef, useState } from "react";
import { useMint } from "../hooks/useMint";
import { useAccount } from "wagmi";
import { PROOF_MINT_NFT_ADDRESS } from "../abi";
import { kite } from "../kite";
import { useOwnedNFT } from "../hooks/useOwnedNFT";

export function ProofMint() {
  const { mint, isLoading: isMinting } = useMint();
  const { address } = useAccount();
  const [proofError, setProofError] = useState<string | null>(null);
  const proofInputRef = useRef<HTMLTextAreaElement>(null);
  const [badgeAddress, setBadgeAddress] = useState<`0x${string}`>(PROOF_MINT_NFT_ADDRESS as `0x${string}`);
  const { ownsNFT: userOwnBadge } = useOwnedNFT(address, badgeAddress);

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-2xl font-bold">Mint with Proof</h1>
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
      </div>
      <div className="flex flex-col space-y-2 w-full">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md h-32 font-mono text-sm"
          placeholder='["0x1234...", "0x5678..."]'
          onChange={(e) => {
            try {
              JSON.parse(e.target.value);
              setProofError(null);
            } catch {
              setProofError("Invalid JSON format");
            }
          }}
          ref={proofInputRef}
        />
        {proofError && <p className="text-red-500 text-sm">{proofError}</p>}
        <button
          onClick={() => {
            try {
              const proofArray = JSON.parse(proofInputRef.current?.value || "[]");
              if (!Array.isArray(proofArray)) throw new Error("Proof must be an array");
              mint(badgeAddress as `0x${string}`, address as `0x${string}`, proofArray);
            } catch (e) {
              setProofError(e instanceof Error ? e.message : "Invalid proof format");
            }
          }}
          disabled={isMinting || !address || userOwnBadge}
          className={`px-4 py-2 rounded-md ${isMinting || !address
            ? "bg-gray-400 cursor-not-allowed"
            : userOwnBadge
              ? "bg-green-500"
              : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
        >
          {isMinting ? "Minting..." : userOwnBadge ? "Already Owned" : "Mint with Proof"}
        </button>
      </div>
    </div>
  );
} 