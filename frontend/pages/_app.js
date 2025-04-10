import '../styles.css';
import { WagmiConfig, createClient, chain, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(
  [chain.goerli], // Swap for another testnet like Goerli if Base isn't supported directly
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'USDEC Test',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
