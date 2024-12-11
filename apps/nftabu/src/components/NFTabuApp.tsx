import { useState } from 'react';
import { Header } from './Header/Header';
import { useAccount } from '@starknet-react/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, PieChart, Users } from 'lucide-react';
import { AppTabs } from '../types/ui';
import { UpcomingAdsTab } from './UpcomingAdsTab/UpcomingAdsTab';
import { StatsTab } from './StatsTab/StatsTab';
import { useAdData } from '../hooks/useAdData';
import { ManagementTab } from './ManagementTab/ManagementTab';

/// A function to create the main NFTabuApp component.
export const NFTabuApp = () => {
  const starknetWallet = useAccount();
  /// useState is a React hook that allows you to have state variables which can be accessed and updated in your component.
  /// In this case, we can access the activeTab value through the activeTab variable.
  /// We can also update the activeTab value by calling the setActiveTab function. This will cause the component to re-render.
  const [activeTab, setActiveTab] = useState<string>(AppTabs.AD_REGISTRATION);
  const {
    pastAds,
    futureAds,
    isAllowedUser,
    foodieRank,
    allTimeAdCount,
    isAdmin,
    loadingAllEvents,
    isSuccessFetchingUserEvents,
    updateAd,
    setSuccessFetchingUserEvents,
  } = useAdData();

  const onConnectWallet = async () => {
    setSuccessFetchingUserEvents(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Header wallet={starknetWallet} onConnectWallet={onConnectWallet} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value={AppTabs.AD_REGISTRATION}>
              <Calendar className="mr-2 h-4 w-4" />
              Ad Registration
            </TabsTrigger>
            <TabsTrigger
              disabled={!starknetWallet.isConnected}
              value={AppTabs.STATS_AND_PREV_ADS}
            >
              <PieChart className="mr-2 h-4 w-4" />
              History & Stats
            </TabsTrigger>
            {isAdmin ? (
              <TabsTrigger value={AppTabs.MANAGEMENT}>
                <Users className="mr-2 h-4 w-4" />
                Management
              </TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent value={AppTabs.AD_REGISTRATION} className="space-y-12">
            <UpcomingAdsTab
              updateAd={updateAd}
              loadingAllEvents={loadingAllEvents}
              isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
              isAllowedUser={isAllowedUser}
              futureAds={futureAds}
              pastAds={pastAds}
              address={starknetWallet?.address}
              onConnectWallet={onConnectWallet}
              isWalletConnected={starknetWallet.isConnected ?? false}
            />
          </TabsContent>
          <TabsContent
            value={AppTabs.STATS_AND_PREV_ADS}
            className="space-y-12"
          >
            <StatsTab
              foodieRank={foodieRank}
              allTimeAdCount={allTimeAdCount}
              setActiveTab={setActiveTab}
              updateAd={updateAd}
              ads={pastAds}
            />
          </TabsContent>
          {isAdmin ? (
            <TabsContent value={AppTabs.MANAGEMENT} className="space-y-12">
              <ManagementTab />
            </TabsContent>
          ) : null}
        </Tabs>
      </main>
    </div>
  );
};
