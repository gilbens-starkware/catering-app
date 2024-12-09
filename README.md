# Welcome to the StarKitchen app monorepo

## Getting Started

Follow these steps to get started with the monorepo and set up your project:

1. **Decide on the Look and Feel**
   - Use tools like [https://v0.dev](https://v0.dev) or similar to play around and decide on the design and aesthetics of your project.

2. **Fork and Clone the Repository**
   - Fork this repository and clone it to your local machine.

3. **Install Node.js**
   - Ensure you have **Node.js v20 or higher** installed on your computer. Download it from [Node.js](https://nodejs.org).

4. **Install `pnpm` Globally**
   - Run the following command to install `pnpm` globally:
     ```bash
     npm install -g pnpm
     ```

5. **Navigate to the Monorepo Root**
   - Change to the root directory of the monorepo:
     ```bash
     cd <path-to-monorepo-root>
     ```

6. **Add Env Variables**
   - Add env variable files - `".env.development"` and `".env.production"` under your-app-name/apps/app-name aka - frontend package root folder (ask Itay/Liad/Gil for variable values)

7. **Update Application Name**
   - Replace all occurrences of `"catering-app"` and `"starkitchen"` in the repository with your desired application name. This may include package names, configurations, or deployment references.

8. **Install Dependencies**
   - Run the following command to install all dependencies:
     ```bash
     pnpm i
     ```

9. **Customize Functionality**
   - Navigate to the `apps/starkitchen` folder:
     ```bash
     cd apps/starkitchen
     ```
   - Start adding or removing functionality to tailor it to your app's requirements. **Important:** Do not delete the `components/ui` folder, as it contains essential UI components.

10. **Run the App**
   - Start the app using one of the following commands:
     - From the `apps/starkitchen` directory:
       ```bash
       pnpm run dev
       ```
     - From the monorepo root:
       ```bash
       pnpm run dev:starkitchen
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
  - You can see your app live on {your-github-username}.github.io/{repo-name} for example: gilbens-starkware.github.io/catering-app
---

### Working With the contracts:

1. **Set contract values**
  - After deploying your contract go to `consts.ts` and change the `ABI` and `CONTRACT_ADDRESS` values.

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

export const SomeComponent = () => {
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
      return [contract.populate("unregister", [meal.id])];
    } else if (isAllowedUser) {
      return [contract.populate("register", [meal.id])];
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
