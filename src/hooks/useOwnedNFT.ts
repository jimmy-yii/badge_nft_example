import { useReadContract } from "wagmi";
import { abi } from "../abi";

export function useOwnedNFT(address: `0x${string}` | undefined, nftAddress: `0x${string}`) {
  const { data: balance, isLoading } = useReadContract({
    address: nftAddress,
    abi: abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  return {
    ownsNFT: balance ? Number(balance) > 0 : false,
    isLoading
  };
}

