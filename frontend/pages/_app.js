import '../styles.css';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { baseSepolia } from 'wagmi/chains';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, publicClient } = configureChains(
  [baseSepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'USDEC Test',
  projectId: 'YOUR_PROJECT_ID', // You can use any test ID or get a real one at walletconnect.com
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
