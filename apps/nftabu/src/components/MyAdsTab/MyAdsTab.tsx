import { useMemo, useState } from 'react';
import { AdCard } from '../AdCard/AdCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { StatsCard } from '../StatsCard/StatsCard';
import { getCurrentDate, groupAdsByMonth } from '../../utils/date';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { EmptyStatsCard } from '../StatsCard/EmptyStatsCard';
import { Ad } from '../../types/ad';

const { month: currentMonth, year: currentYear } = getCurrentDate();

export const MyAdsTab = ({
  setActiveTab,
  updateAd,
  ads,
  foodieRank,
  allTimeAdCount,
}: {
  updateAd: (adId: string) => void;
  foodieRank?: number;
  allTimeAdCount?: number;
  ads: Ad[];
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    `${currentYear}-${currentMonth}`,
  );
  const adsGroupedByMonth = useMemo(
    () =>
      groupAdsByMonth(ads.filter(({ info: { registered } }) => registered)),
    [ads],
  );
  const monthlyStats = useMonthlyStats({ adsGroupedByMonth });

  const selectedMonthStats = monthlyStats.find(
    stat => stat.month === selectedDate,
  );

  const adCount = Object.values(selectedMonthStats?.adsByDay ?? {}).reduce(
    (adsCount, acc) => adsCount + acc,
    0,
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">History & Stats</h2>
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthlyStats.map(stat => (
              <SelectItem key={stat.month} value={stat.month}>
                {new Date(stat.month).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {adCount === 0 ? (
          <EmptyStatsCard setActiveTab={setActiveTab} />
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">Past Ads</h3>
            <div className="space-y-4">
              {(adsGroupedByMonth[selectedDate] ?? []).map(ad => (
                <AdCard
                  key={ad.id}
                  updateAd={updateAd}
                  isWalletConnected
                  ad={ad}
                  isPastAd
                />
              ))}
            </div>
          </div>
        )}
        <StatsCard
          allTimeAdCount={allTimeAdCount}
          foodieRank={foodieRank}
          stats={selectedMonthStats}
        />
      </div>
    </>
  );
};
