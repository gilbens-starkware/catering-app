import { LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { DisconnectWalletDialog } from "../Dialogs/DisconnectWalletDialog";
import { useCallback, useState } from "react";
import { SrcPrefix } from "../../utils/consts";
import { truncateAddress } from "../../utils/string";
import {UseAccountResult, useDisconnect } from '@starknet-react/core';
import { ConnectWalletButton } from "../ConnectWalletButton/ConnectWalletButton";

export const Header = ({
  onConnectWallet,
  wallet,
}: {
  onConnectWallet: () => void;
  wallet?: UseAccountResult,
}) => {
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState<boolean>(false);
  const {disconnect} = useDisconnect();
  const handleCloseDisconnectDialog = useCallback(() => {
    setIsDisconnectDialogOpen(false);
  }, [])
  
  const handleDisconnect = useCallback(() => {
    disconnect();
    handleCloseDisconnectDialog();
  }, []);

  const openDisconnectDialog = () => {
    setIsDisconnectDialogOpen(true);
  }

  return (
    <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img src={`${SrcPrefix}/starkitchen-logo-transparent.png`} alt="StarKitchen Logo" className="h-12" />
              <h1 className="text-3xl font-bold text-gray-900">StarKitchen</h1>
            </div>
            <div className="flex items-center space-x-4">
                {wallet?.isConnected ? (
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                  <span className="text-sm font-medium text-gray-500">
                    {truncateAddress(wallet?.address ?? '')}
                  </span>
                  <Button variant="ghost" size="sm" onClick={openDisconnectDialog}>
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect wallet</span>
                  </Button>
                </div>
              ) : (
                <ConnectWalletButton onConnect={onConnectWallet} />
              )}
            </div>
          </div>
        </div>
        <DisconnectWalletDialog onDisconnect={handleDisconnect} open={isDisconnectDialogOpen} onClose={handleCloseDisconnectDialog} />
      </header>
  )
}
