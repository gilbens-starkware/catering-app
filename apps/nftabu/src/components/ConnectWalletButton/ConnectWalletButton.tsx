import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { ChevronRight, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { useConnect } from '@starknet-react/core';

const colors = [
  'from-purple-500 to-indigo-600',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-teal-500',
  'from-red-500 to-pink-500',
  'from-yellow-500 to-orange-500',
  'from-gray-700 to-gray-900',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-green-500',
  'from-orange-500 to-red-500',
  'from-blue-400 to-blue-600',
];

export const ConnectWalletButton = ({
  onConnect,
}: {
  onConnect?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const onToggleVisibility = () => {
    setOpen(!open);
  };

  const onConnectWallet = () => {
    setOpen(true);
    onConnect?.();
  };

  return (
    <>
      <Button onClick={onConnectWallet}>
        <WalletIcon className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
      <ConnectWalletDialog
        open={open}
        onToggleVisibility={onToggleVisibility}
      />
    </>
  );
};

const ConnectWalletDialog = ({
  open,
  onToggleVisibility,
}: {
  open: boolean;
  onToggleVisibility: () => void;
}) => {
  const { connectors, connectAsync } = useConnect();
  const [connectingWalletIndex, setConnectingWalletIndex] = useState<
    number | null
  >(null);

  return (
    <AlertDialog open={open} onOpenChange={onToggleVisibility}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">
            Connect Wallet
          </AlertDialogTitle>
          <AlertDialogDescription>
            Choose a wallet to connect with StarKitchen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-[400px] overflow-y-auto py-4 pr-4 -mr-4">
          <div className="grid gap-4">
            {connectors.map((connector, index) => (
              <button
                key={connector.id}
                disabled={connectingWalletIndex !== null}
                onClick={async () => {
                  setConnectingWalletIndex(index);
                  await connectAsync({ connector });
                  setConnectingWalletIndex(null);
                }}
                className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${colors[index % connectors.length]} text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg ${connectingWalletIndex !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 bg-white rounded-full flex items-center justify-center">
                    <img
                      src={
                        typeof connector.icon === 'string'
                          ? connector.icon
                          : connector.icon.light
                      }
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-lg font-semibold">
                    {connector.name}
                  </span>
                </div>
                {connectingWalletIndex === index ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            ))}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
