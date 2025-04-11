import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import usdecAbi from '../usdecAbi.json';

const USDEC_ADDRESS = '0xcd6a6f61aee308885ae837a539418de3a63ffabc96229e966b93c53f206b19bb';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  const { config } = usePrepareContractWrite({
  address: USDEC_ADDRESS,
  abi: usdecAbi,
  functionName: 'mint',
  enabled: isConnected && isValidAmount && !!address,
  args: address && isValidAmount ? [address, parsedAmount * 1e6] : undefined,
});

  const { write, isLoading } = useContractWrite(config);
  
  console.log({ isConnected, isValidAmount, config, write });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>USDEC Testnet App</h1>
      <ConnectButton />
      {isConnected && (
        <div style={{ marginTop: '2rem' }}>
          <input
            type="number"
            placeholder="Amount (Max 500 USDC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <button
            onClick={() => write?.()}
            disabled={!write || isLoading}
            style={{ marginLeft: '1rem' }}
          >
            {isLoading ? 'Minting...' : 'Mint USDEC'}
          </button>
        </div>
      )}
    </div>
  );
}
