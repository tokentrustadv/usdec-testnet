import { useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import usdecAbi from '../usdecAbi.json';

const USDEC_ADDRESS = '0xcd6a6f61aee308885ae837a539418de3a63ffabc96229e966b93c53f206b19bb';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  const parsedAmount = useMemo(() => {
    if (!amount) return undefined;
    return parseInt(amount) * 1e6;
  }, [amount]);

  const { config } = usePrepareContractWrite({
    address: USDEC_ADDRESS,
    abi: usdecAbi,
    functionName: 'mint',
    args: parsedAmount !== undefined ? [parsedAmount] : undefined,
    enabled: parsedAmount !== undefined,
  });

  const { write } = useContractWrite(config);

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
          />
          <button onClick={() => write?.()} disabled={!write}>
            Mint USDEC
          </button>
        </div>
      )}
    </div>
  );
}
