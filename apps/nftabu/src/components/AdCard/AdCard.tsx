import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { AlertCircle, Check, Users, UtensilsCrossed, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Ad } from '../../types/ad';
import { openFullscreenLoader } from '../FullscreenLoaderModal/FullscreenLoaderModal';
import { shortString } from "starknet";
import { ABI, CONTRACT_ADDRESS } from '../../utils/consts';
import { useContract, useSendTransaction } from '@starknet-react/core';
import { useMemo } from 'react';
import { TypedContractV2 } from 'starknet';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';

export const AdCard = ({
  ad,
  onConnectWallet,
  updateAd,
  isSuccessFetchingUserEvents = false,
  isPastAd = false,
  isWalletConnected = false,
  isAllowedUser = false,
  isNextAd = false,
}: {
  ad: Ad;
  isPastAd?: boolean;
  isWalletConnected?: boolean;
  isSuccessFetchingUserEvents?: boolean;
  onConnectWallet?: () => void;
  updateAd?: (adId: string) => void;
  isAllowedUser?: boolean;
  isNextAd?: boolean;
}) => {
  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  }) as { contract?: TypedContractV2<typeof ABI> };

  const calls = useMemo(() => {
    if (!contract) return undefined;
    if (ad.info.registered) {
      return [contract.populate('unregister', [ad.id])];
    } else if (isAllowedUser) {
      return [contract.populate('register', [ad.id])];
    }
  }, [ad.info.registered, contract, isAllowedUser]);

  const { sendAsync } = useSendTransaction({
    calls,
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleRegistration = async () => {
    let closeFullscreenLoader;
    try {
      closeFullscreenLoader = openFullscreenLoader(
        'Registering you to the selected ad...',
      );
      const { transaction_hash } = await sendAsync();
      await contract?.providerOrAccount?.waitForTransaction(transaction_hash, {
        retryInterval: 2e3,
      });
      updateAd?.(ad.id);
    } catch (e) {
      console.error('Error: ad status update failed', e);
    } finally {
      closeFullscreenLoader?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center min-h-[30px]">
          {isNextAd ? 'Next Ad' : isPastAd ? 'Ad Ended' : 'Future Ad'}
          {ad.info.registered ? (
            <Badge variant="secondary" className="ml-2">
              Registered
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          {formatDate(new Date(Number(ad.info.time.seconds) * 1000))}
        </p>
        {ad?.info?.number_of_participants !== undefined ? (
          <p className="text-sm text-gray-500 mt-2">
            <Users className="inline-block mr-1 h-4 w-4" />
            {Number(ad.info.number_of_participants)} registered
          </p>
        ) : null}
        <p className="text-sm text-gray-700 mt-2">
          <UtensilsCrossed className="inline-block mr-1 h-4 w-4" />
          Catering:{' '}
          {shortString.decodeShortString(ad.info?.description ?? '') ?? 'Not Set Yet'}
        </p>
        {isWalletConnected &&
        !isAllowedUser &&
        isSuccessFetchingUserEvents &&
        !ad.info.registered ? (
          <div className="flex items-center mt-2 text-red-500">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">
              You're not allowed to register to ads, yet!
            </span>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        {isWalletConnected ? (
          <Button
            className={`w-full ${ad.info.registered ? 'text-red-500 border-red-500 bg-red-50 hover:text-red-500 hover:border-red-500 hover:bg-red-100' : ''}`}
            onClick={handleRegistration}
            disabled={
              isWalletConnected && !isAllowedUser && !ad.info.registered
            }
          >
            {ad.info.registered ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Unregister
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Register
              </>
            )}
          </Button>
        ) : (
          <ConnectWalletButton onConnect={onConnectWallet} />
        )}
      </CardFooter>
    </Card>
  );
};
