import { AppTabs } from '../../types/ui';
import { SrcPrefix } from '../../utils/consts';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export const EmptyStatsCard = ({
  setActiveTab,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleNavigateToUpcomingMeals = () => {
    setActiveTab(AppTabs.MEAL_REGISTRATION);
  };

  return (
    <Card className="p-6 text-center">
      <CardContent className="flex flex-col items-center">
        <img
          src={`${SrcPrefix}/empty-meals-illustration.webp`}
          alt="no-meals-illustration"
          className="h-56 w-56 rounded-xl"
        />
        <h3 className="text-xl font-semibold mt-4 mb-2">No meals found</h3>
        <p className="text-gray-600 max-w-md">
          {`You haven\'t participated in any meals in the selected month. Start your culinary journey by registering for an upcoming meal!`}
        </p>
        <Button className="mt-4" onClick={handleNavigateToUpcomingMeals}>
          Explore Upcoming Meals
        </Button>
      </CardContent>
    </Card>
  );
};
