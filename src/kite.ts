import { createAppKit } from "@reown/appkit";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { AppKitNetwork, mainnet } from "@reown/appkit/networks";
import { defineChain } from "viem";
import { createPublicClient } from "viem";
import { http, createConfig } from 'wagmi'

export const kite = defineChain({
  id: 2368,
  name: 'KiteAI Testnet',
  nativeCurrency: {
    name: 'KiteAI',
    symbol: 'KITE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.gokite.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: 'KiteAI Explorer',
      url: 'https://testnet.kitescan.ai',
    },
  },
})

export const client = createPublicClient({
  chain: kite,
  transport: http(),
})


export const wagmiConfig = createConfig({
  chains: [kite],
  transports: {
    [kite.id]: http(),
  },
})

// 1. Get projectId from https://cloud.reown.com
const projectId = '2d04d50e092c6d30a12caae0d9b42728'

// 2. Create a metadata object - optional
const metadata = {
  name: 'KiteAI',
  description: 'KiteAI Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [kite] as [AppKitNetwork, ...AppKitNetwork[]]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  themeMode: 'light',
  features: {
    analytics: false 
  }
})
