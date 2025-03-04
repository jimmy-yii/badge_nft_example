import { useCallback, useState } from "react";
import { NFT_ADDRESS, abi } from "../abi";
import { useWalletClient } from "wagmi";
import { client } from "../kite";
import { TransactionReceipt } from "viem";
export const useMint = () => {
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionReceipt | null>(null);

  const mint = useCallback(async (to: `0x${string}`, proof: `0x${string}`[]) => {
    if (!walletClient) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: NFT_ADDRESS as `0x${string}`,
        abi,
        functionName: "mint",
        args: [to, proof],
      });

      const result = await client.waitForTransactionReceipt({ hash });
      setIsLoading(false);
      setResult(result);
      if (result.status === "success") {
        setResult(result);
      } else {
        setError(new Error("Mint failed, status: " + result.status))
      }
    } catch (err) {
      // user can cancel the transaction
      if (err instanceof Error && err.message.includes("User rejected the request")) {
        setError(new Error("Transaction cancelled"));
      } else {
        const error = err instanceof Error ? err : new Error("Failed to mint");
        setError(error);
      }
      setIsLoading(false);
      throw err;
    }
  }, [walletClient]);

  return {
    mint,
    isLoading,
    error,
    result
  };
};

