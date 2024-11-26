import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { AlertCircle, Check, WalletIcon, X } from "lucide-react"
import { Badge } from '../ui/badge'
import { Meal } from "../../types/meal"
import { useCateringContract } from "../../hooks/useCateringContract"
import { openFullscreenLoader } from "../FullscreenLoaderModal/FullscreenLoaderModal"

export const MealCard = ({ 
  meal,
  connect,
  updateMeal,
  isSuccessFetchingUserEvents = false,
  isPastMeal = false,
  isWalletConnected = false,
  isAllowedUser = false,
  isNextMeal = false 
}: { 
  meal: Meal,
  isPastMeal?: boolean; 
  isWalletConnected?: boolean,
  isSuccessFetchingUserEvents?: boolean;
  connect?: () => void,
  updateMeal?: (mealId: string) => void,
  isAllowedUser?: boolean,
  isNextMeal?: boolean 
}) => {
  const contract = useCateringContract();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const handleRegistration = async () => {
    let closeFullscreenLoader;
    try {
      if (meal.info.registered) {
        closeFullscreenLoader = openFullscreenLoader('Unregistering you from meal...');
        const {transaction_hash} = await contract?.unregister(meal.id);
        await contract?.providerOrAccount?.waitForTransaction(transaction_hash, { retryInterval: 2e3 });
        updateMeal?.(meal.id);
      } else if (isAllowedUser) {
        closeFullscreenLoader = openFullscreenLoader('Booking you up...');
        const {transaction_hash} = await contract?.register(meal.id);
        await contract?.providerOrAccount?.waitForTransaction(transaction_hash, { retryInterval: 2e3 });
        updateMeal?.(meal.id);
      }
    } catch (e) {
      console.error('Error: meal status update failed', e);
    } finally {
      closeFullscreenLoader?.();
    }
  }

  return (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center min-h-[30px]">
        {isNextMeal ? 'Next Meal' : isPastMeal ? 'Past Meal' : 'Future Meal'}
        {meal.info.registered ? (
          <Badge variant="secondary" className="ml-2">
            Registered
          </Badge>
        ) : null}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold">{formatDate(new Date(Number(meal.info.time.seconds) * 1000))}</p>
      {isWalletConnected && !isAllowedUser && isSuccessFetchingUserEvents && !meal.info.registered ? (
        <div className="flex items-center mt-2 text-red-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">You're not allowed to register to meals, yet!</span>
        </div>
      ) : null}
    </CardContent>
    {isPastMeal ? null : (
      <CardFooter>
      {isWalletConnected ? (
        <Button 
          className="w-full" 
          onClick={handleRegistration}
          disabled={isWalletConnected && !isAllowedUser && !meal.info.registered}
        >
          {meal.info.registered ? (
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
        <Button onClick={connect}>
          <WalletIcon className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </CardFooter>)}
  </Card>
)}