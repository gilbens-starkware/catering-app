import { useMemo, useState } from 'react';
import { MealCard } from '../MealCard/MealCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { StatsCard } from '../StatsCard/StatsCard';
import { getCurrentDate, groupMealsByMonth } from '../../utils/date';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { EmptyStatsCard } from '../StatsCard/EmptyStatsCard';
import { Meal } from '../../types/meal';

const { month: currentMonth, year: currentYear } = getCurrentDate();

export const StatsTab = ({
  setActiveTab,
  updateMeal,
  meals,
  foodieRank,
  allTimeMealCount,
}: {
  updateMeal: (mealId: string) => void;
  foodieRank?: number;
  allTimeMealCount?: number;
  meals: Meal[];
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    `${currentYear}-${currentMonth}`,
  );
  const mealsGroupedByMonth = useMemo(
    () =>
      groupMealsByMonth(meals.filter(({ info: { registered } }) => registered)),
    [meals],
  );
  const monthlyStats = useMonthlyStats({ mealsGroupedByMonth });

  const selectedMonthStats = monthlyStats.find(
    stat => stat.month === selectedDate,
  );

  const mealCount = Object.values(selectedMonthStats?.mealsByDay ?? {}).reduce(
    (mealsCount, acc) => mealsCount + acc,
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
        {mealCount === 0 ? (
          <EmptyStatsCard setActiveTab={setActiveTab} />
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">Past Meals</h3>
            <div className="space-y-4">
              {(mealsGroupedByMonth[selectedDate] ?? []).map(meal => (
                <MealCard
                  key={meal.id}
                  updateMeal={updateMeal}
                  isWalletConnected
                  meal={meal}
                  isPastMeal
                />
              ))}
            </div>
          </div>
        )}
        <StatsCard
          allTimeMealCount={allTimeMealCount}
          foodieRank={foodieRank}
          stats={selectedMonthStats}
        />
      </div>
    </>
  );
};
