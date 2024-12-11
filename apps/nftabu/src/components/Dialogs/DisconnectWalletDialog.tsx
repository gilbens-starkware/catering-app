import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const DisconnectWalletDialog = ({
  open,
  onDisconnect,
  onClose,
}: {
  open: boolean;
  onDisconnect: () => void;
  onClose: () => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[300px] sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect Wallet</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disconnect your wallet?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDisconnect}>
            Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
