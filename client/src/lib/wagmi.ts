import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { mantleSepolia } from "./config";

export const config = getDefaultConfig({
  appName: "Playo",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
    "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [mantleSepolia],
  transports: {
    [mantleSepolia.id]: http("https://rpc.sepolia.mantle.xyz", {
      batch: {
        wait: 100, // Batch requests to reduce RPC calls
      },
      retryCount: 3, // Retry failed requests
      retryDelay: 1000, // Wait 1s between retries
      timeout: 30_000, // 30s timeout
    }),
  },
  ssr: false,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
