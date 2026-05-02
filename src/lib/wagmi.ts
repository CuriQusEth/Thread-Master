/**
 * Wagmi Configuration for Thread Master
 * Enables wallet connections and ERC-8021 attribution via useSendCalls
 */

import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID (optional - can be configured via env)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'threadmaster-default';

/**
 * Wagmi configuration with Base network support
 */
export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Thread Master',
      appLogoUrl: 'https://threadmaster.app/logo.png',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'Thread Master',
        description: 'Untangle the chaos, master the thread',
        url: 'https://threadmaster.app',
        icons: ['https://threadmaster.app/logo.png'],
      },
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
