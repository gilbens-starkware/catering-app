import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { StarknetWallet } from "@dynamic-labs/starknet";
import { useMemo } from "react";

export const useStarknetWallet = () => {
  const wallets = useUserWallets();

  const starknetWallet = useMemo(() => {
    return wallets.find(wallet => wallet.chain === 'STARK') as StarknetWallet;
  }, [wallets]);

  return starknetWallet;
}
