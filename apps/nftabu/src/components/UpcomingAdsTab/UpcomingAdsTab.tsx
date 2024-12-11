import { Ad } from '../../types/ad';
import { AdCard } from '../AdCard/AdCard';
import { AdCardSkeleton } from '../AdCardSkeleton/AdCardSkeleton';

export const UpcomingAdsTab = ({
  isAllowedUser,
  onConnectWallet,
  updateAd,
  futureAds,
  pastAds,
  loadingAllEvents,
  isSuccessFetchingUserEvents,
  isWalletConnected,
}: {
  address?: string;
  futureAds: Ad[];
  pastAds: Ad[];
  isAllowedUser?: boolean;
  loadingAllEvents: boolean;
  isSuccessFetchingUserEvents: boolean;
  updateAd: (adId: string) => void;
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}) => {
  if (!loadingAllEvents && !futureAds[0]) {
    return <div>No upcoming futureAds to display</div>;
  }

  return (
    <>
      {loadingAllEvents ? (
        <AdCardSkeleton />
      ) : (
        <AdCard
          isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
          updateAd={updateAd}
          onConnectWallet={onConnectWallet}
          isAllowedUser={isAllowedUser}
          ad={futureAds[0]}
          isWalletConnected={isWalletConnected}
          isNextAd
        />
      )}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Apartments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingAllEvents
            ? Array(6)
                .fill(null)
                .map((_, index) => <AdCardSkeleton key={index} />)
            : futureAds
                .slice(1, 7)
                .map((ad, index) => (
                  <AdCard
                    isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
                    updateAd={updateAd}
                    onConnectWallet={onConnectWallet}
                    isAllowedUser={isAllowedUser}
                    key={ad.id ?? index}
                    ad={ad}
                    isWalletConnected={isWalletConnected}
                  />
                ))}
        </div>
        <h2 className="text-2xl font-bold mb-6 mt-12">History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingAllEvents
            ? Array(6)
                .fill(null)
                .map((_, index) => <AdCardSkeleton key={index} />)
            : pastAds
                .reverse()
                .slice(0, 6)
                .map((ad, index) => (
                  <AdCard
                    isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
                    isPastAd
                    updateAd={updateAd}
                    onConnectWallet={onConnectWallet}
                    isAllowedUser={isAllowedUser}
                    key={ad.id ?? index}
                    ad={ad}
                    isWalletConnected={isWalletConnected}
                  />
                ))}
        </div>
      </div>
    </>
  );
};
