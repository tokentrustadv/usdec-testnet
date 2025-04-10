import { useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import usdecAbi from '../usdecAbi.json';

const USDEC_ADDRESS = '0x7c06dFaE7856e1D1715b0B4f0A6F1Dd735ba9602';

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
