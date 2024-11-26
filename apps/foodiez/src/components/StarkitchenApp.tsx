import { useState } from 'react'
import { Header } from './Header/Header'
import { useDynamicContext, useUserWallets } from '@dynamic-labs/sdk-react-core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Calendar, PieChart, Users } from 'lucide-react'
import { AppTabs } from '../types/ui'
import { UpcomingMealsTab } from './UpcomingMealsTab/UpcomingMealsTab'
import { StatsTab } from './StatsTab/StatsTab'
import { useMealEvents } from '../hooks/useMealEvents';
// import { ManagementTab } from './ManagementTab/ManagementTab'

export const StarkitchenApp = () => {
  const {setShowAuthFlow} = useDynamicContext();
  const [activeTab, setActiveTab] = useState<string>(AppTabs.UPCOMING_MEALS);
  const wallets = useUserWallets();
  const {pastMeals, futureMeals, isAllowedUser, loadingAllEvents, isSuccessFetchingUserEvents, updateMeal, setSuccessFetchingUserEvents} = useMealEvents();

  const starknetWallet = wallets.find(wallet => wallet.chain === 'STARK');

  const isWalletConnected = Boolean(starknetWallet);

  const onConnectWallet = async () => {
    setShowAuthFlow(true);
    setSuccessFetchingUserEvents(false);
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Header wallet={starknetWallet} isConnected={isWalletConnected} onConnectWallet={onConnectWallet} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value={AppTabs.UPCOMING_MEALS}>
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Meals
          </TabsTrigger>
          <TabsTrigger disabled={!isWalletConnected} value={AppTabs.STATS_AND_PREV_MEALS}>
            <PieChart className="mr-2 h-4 w-4" />
            History & Stats
          </TabsTrigger>
          <TabsTrigger value="management">
              <Users className="mr-2 h-4 w-4" />
              Management
            </TabsTrigger>
        </TabsList>
        <TabsContent value={AppTabs.UPCOMING_MEALS} className="space-y-12">
          <UpcomingMealsTab
            updateMeal={updateMeal}
            loadingAllEvents={loadingAllEvents}
            isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
            isAllowedUser={isAllowedUser}
            meals={futureMeals}
            address={starknetWallet?.address} 
            onConnectWallet={onConnectWallet}
            isWalletConnected={isWalletConnected}
          />
        </TabsContent>
        <TabsContent value={AppTabs.STATS_AND_PREV_MEALS} className="space-y-12">
          <StatsTab
            setActiveTab={setActiveTab}
            meals={pastMeals}
          />
        </TabsContent>
        <TabsContent value={AppTabs.MANAGEMENT} className="space-y-12">
          {/* <ManagementTab />   */}
        </TabsContent>
      </Tabs>
      </main>
    </div>
  )
}
