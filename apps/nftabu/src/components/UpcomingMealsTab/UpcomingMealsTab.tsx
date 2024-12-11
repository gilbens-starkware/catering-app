import { Meal } from '../../types/meal';
import { MealCard } from '../MealCard/MealCard';
import { MealCardSkeleton } from '../MealCardSkeleton/MealCardSkeleton';

export const UpcomingMealsTab = ({
  isAllowedUser,
  onConnectWallet,
  updateMeal,
  futureMeals,
  pastMeals,
  loadingAllEvents,
  isSuccessFetchingUserEvents,
  isWalletConnected,
}: {
  address?: string;
  futureMeals: Meal[];
  pastMeals: Meal[];
  isAllowedUser?: boolean;
  loadingAllEvents: boolean;
  isSuccessFetchingUserEvents: boolean;
  updateMeal: (mealId: string) => void;
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}) => {
  if (!loadingAllEvents && !futureMeals[0]) {
    return <div>No upcoming futureMeals to display</div>;
  }

  return (
    <>
      {loadingAllEvents ? (
        <MealCardSkeleton />
      ) : (
        <MealCard
          isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
          updateMeal={updateMeal}
          onConnectWallet={onConnectWallet}
          isAllowedUser={isAllowedUser}
          meal={futureMeals[0]}
          isWalletConnected={isWalletConnected}
          isNextMeal
        />
      )}
      <div>
        <h2 className="text-2xl font-bold mb-6">Future Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingAllEvents
            ? Array(6)
                .fill(null)
                .map((_, index) => <MealCardSkeleton key={index} />)
            : futureMeals
                .slice(1, 7)
                .map((meal, index) => (
                  <MealCard
                    isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
                    updateMeal={updateMeal}
                    onConnectWallet={onConnectWallet}
                    isAllowedUser={isAllowedUser}
                    key={meal.id ?? index}
                    meal={meal}
                    isWalletConnected={isWalletConnected}
                  />
                ))}
        </div>
        <h2 className="text-2xl font-bold mb-6 mt-12">Past Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingAllEvents
            ? Array(6)
                .fill(null)
                .map((_, index) => <MealCardSkeleton key={index} />)
            : pastMeals
                .reverse()
                .slice(0, 6)
                .map((meal, index) => (
                  <MealCard
                    isSuccessFetchingUserEvents={isSuccessFetchingUserEvents}
                    isPastMeal
                    updateMeal={updateMeal}
                    onConnectWallet={onConnectWallet}
                    isAllowedUser={isAllowedUser}
                    key={meal.id ?? index}
                    meal={meal}
                    isWalletConnected={isWalletConnected}
                  />
                ))}
        </div>
      </div>
    </>
  );
};
