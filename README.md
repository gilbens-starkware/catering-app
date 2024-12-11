# Welcome to the nftabu app monorepo

This repo contains an example of an app built on top of Starknet using React and Cairo.
The main goal of this repo is to be used as a template for your Starknet app.

## Getting Started (Front End)

This section covers the first needed to run the app and make modifications to the front end. For editing the smart contract see [packages/contracts/README.md]

Follow these steps to get started with the monorepo and set up your project:

1. **Fork and Clone the Repository**
   - Fork this repository and clone it to your local machine.

2. **Install Node.js**
   - Ensure you have **Node.js v20 or higher** installed on your computer. Download it from [Node.js](https://nodejs.org).

3. **Install `pnpm` Globally**
   - Run the following command to install `pnpm` globally:
     ```bash
     npm install -g pnpm
     ```

4. **Navigate to the Monorepo Root**
   - Change to the root directory of the monorepo:
     ```bash
     cd <path-to-monorepo-root>
     ```

5. **Install Dependencies**
   - Run the following command to install all dependencies:
     ```bash
     pnpm i
     ```

6. **Update Application Name (optional)**
   - Replace all occurrences of `"nftabu-app"` and `"nftabu"` in the repository with your desired application name. This may include package names, configurations, or deployment references.


7. **Customize Functionality**
   - Navigate to the `apps/nftabu` folder:
     ```bash
     cd apps/nftabu
     ```
   - Start adding or removing functionality to tailor it to your app's requirements. **Important:** Do not delete the `components/ui` folder, as it contains essential UI components.
   - You can use tools like [https://v0.dev](https://v0.dev) or similar to play around and decide on the design and aesthetics of your project.

9. **Run the App**
   - Start the app using one of the following commands:
     - From the `apps/nftabu` directory:
       ```bash
       pnpm run dev
       ```
     - From the monorepo root:
       ```bash
       pnpm run dev:nftabu
       ```

### IMPORTANT: Deployment

1. **Make the Repository Public**
   - Update the repository visibility to **public** in your Git hosting provider (e.g., GitHub).

2. **Deploy the App**
   - Deploy the app using:
     ```bash
     pnpm run deploy
     ```

3. **Explore Other Scripts**
   - Check the `package.json` file for other available scripts and explore their functionality.

4. **Check your deployed app**
  - You can see your app live on {your-github-username}.github.io/{repo-name} for example: gilbens-starkware.github.io/nftabu-app
---

### Working With the contracts:

1. **Set contract values**
  - After deploying your contract go to `consts.ts` and change the `ABI` and `CONTRACT_ADDRESS` values (see details in the file).

2. **`useAccount` hook** 
  - use the `useAccount` hook to get the connected user wallet address.

```tsx
import React from 'react';
import { useAccount } from '@starknet-react/core';

export const SomeComponent = () => {
  const {address, isConnecting} = useAccount();

  if (isConnecting) {
    return <div>Connecting to wallet...</div>
  }

  return address ? (
    <div>{`Wallet Address: ${address}`}</div> 
  ) :  (
    <div>No wallet connected</div>
  )
};
```

3. **ConnectWalletButton** 
  - use the `ConnectWalletButton` in order to display the `Connect Wallet`.

```tsx
import React from 'react';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';
import {useAccount, useDisconnect} from '@starknet-react/core';

export const SomeComponent = () => {
  const {isConnected, address} = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <button onClick={disconnect}>disconnect</div>
        <div>{address}</div>
      </div>
    );
  }
  
  return <ConnectWalletButton />
};
```

4. **`Read From Contract` with `useReadContract`**
  - [docs](https://www.starknet-react.com/docs/hooks/use-read-contract) and an example for this hook: 

```tsx
import React from 'react';
import { useAccount, useReadContract } from "@starknet-react/core";
import { ABI, CONTRACT_ADDRESS } from "@/utils/consts";

export const SomeComponent = () => {
  const {address, isConnecting} = useAccount();
  const {data: isAdmin, refetch: getIsAdmin, isFetching} = useReadContract({ 
    functionName: 'is_admin', 
    enabled: false, // the default is true - if not set to false the api call will happen immediately
    abi: ABI,
    address: CONTRACT_ADDRESS,
    args: [address] // arguments to the contract's is_admin method
  });

  useEffect(() => {
    getIsAdmin(); // Fetch The data whenever you want - or remove the "enabled: false" and make the api call run immediately.
  }, [])

  if (isFetching) {
    return <div>Fetching Data...</div>
  }

  return isAdmin ? <div>I am an admin</div> : <div>I am not an admin</div>;
};
```

4. **`Write To Contract` with `useContract` and `useSendTransaction`**
  - [useContract docs](https://www.starknet-react.com/docs/hooks/use-contract) and [useSendTransaction docs](https://www.starknet-react.com/docs/hooks/use-read-contract) and an example for this hook: 

```tsx
import React from 'react';
import { useContract, useSendTransaction } from "@starknet-react/core";
import { ABI, CONTRACT_ADDRESS } from "@/utils/consts";

export const SomeComponent = () => {
  
  const {contract} = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  }) as { contract?: TypedContractV2<typeof ABI> };;

  const calls = useMemo(() => {
    if (!contract) return undefined;
    if (someData) {
      return [contract.populate("unregister", [ad.id])];
    } else if (isAllowedUser) {
      return [contract.populate("register", [ad.id])];
    }
  }, [someData, contract])

  const { sendAsync } = useSendTransaction({ 
    calls, 
  });  

  const onClick = () => {
    const {transaction_hash} = await sendAsync();
    await contract?.providerOrAccount?.waitForTransaction(transaction_hash, { retryInterval: 2e3 });
  }
  
  return <button onClick={onClick}>click me</button>;
};
```
