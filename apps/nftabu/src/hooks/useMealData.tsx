import { useCallback, useEffect, useMemo, useState } from 'react';
import { Meal } from '../types/meal';
import {
  getStartMonthOfEventTracking,
  getTimestampForFirstDayOfMonth,
} from '../utils/date';
import { useAccount, useReadContract } from '@starknet-react/core';
import { ABI, CONTRACT_ADDRESS } from '@/utils/consts';

const aYearAgoTimestampSeconds = getTimestampForFirstDayOfMonth(
  getStartMonthOfEventTracking(),
);
const aMonthFromNowTimestampSeconds =
  Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

/// Various hooks to interact with the meal contract.
export const useMealData = () => {
  const [loadingAllEvents, setLoadingAllEvents] = useState(true);
  const [isSuccessFetchingUserEvents, setSuccessFetchingUserEvents] =
    useState(false);
  const { address, isConnecting } = useAccount();
  const { data: isAdmin, refetch: getIsAdmin } = useReadContract({
    // Read data from the contract
    functionName: 'is_admin', // The function name in the contract
    enabled: false, // Should we fetch the data immediately or later(manually)
    abi: ABI, // TODO: Replace with your own ABI
    address: CONTRACT_ADDRESS, // TODO: Replate with your contract address
    args: [address], // The contract method's arguments as an array
  });
  const { data: isAllowedUser, refetch: getIsAllowedUser } = useReadContract({
    functionName: 'is_allowed_user',
    enabled: false,
    abi: ABI,
    address: CONTRACT_ADDRESS,
    args: [address],
  });

  const { data: allTimeReportResponse, refetch: getParticipationReportByTime } =
    useReadContract({
      enabled: false,
      functionName: 'get_participation_report_by_time',
      abi: ABI,
      address: CONTRACT_ADDRESS,
      args: [{ seconds: 0 }, { seconds: 2734816767 }],
    });
  const { data: rawMealEvents, refetch: getEventsInfosByTime } =
    useReadContract({
      functionName: 'get_events_infos_by_time',
      enabled: false,
      abi: ABI,
      address: CONTRACT_ADDRESS,
      args: [
        { seconds: aYearAgoTimestampSeconds },
        { seconds: aMonthFromNowTimestampSeconds },
      ],
    });
  const { data: rawUserMealParticipations, refetch: getUserEventsByTime } =
    useReadContract({
      functionName: 'get_user_events_by_time',
      enabled: false,
      abi: ABI,
      address: CONTRACT_ADDRESS,
      args: [
        address,
        { seconds: aYearAgoTimestampSeconds },
        { seconds: aMonthFromNowTimestampSeconds },
      ],
    });
  const [userMealParticipations, setUserMealParticipations] = useState<Meal[]>(
    [],
  );
  const [mealEvents, setMealEvents] = useState<Meal[]>([]);

  useEffect(() => setMealEvents(rawMealEvents), [rawMealEvents]);
  useEffect(
    () => setUserMealParticipations(rawUserMealParticipations),
    [rawUserMealParticipations],
  );

  const { foodieRank, allTimeMealCount } = address
    ? extractGlobalStatsFromReport(allTimeReportResponse ?? [], address)
    : { foodieRank: 0, allTimeMealCount: 0 };

  const enhancedMealEvents = useMemo(
    () => addUserParticipationToMealEvents(mealEvents, userMealParticipations),
    [mealEvents, userMealParticipations],
  );

  const updateMeal = useCallback(
    async (mealId: string) => {
      const indexOfUpdatedMeal = enhancedMealEvents
        .map(meal => meal.id)
        .indexOf(mealId);
      const oldMeal = enhancedMealEvents[indexOfUpdatedMeal];

      const oldParticipantCount = Number(oldMeal.info.number_of_participants);
      const isUnregistering = oldMeal.info.registered;
      const newMeal: Meal = {
        ...oldMeal,
        info: {
          ...oldMeal.info,
          registered: !oldMeal.info.registered,
          number_of_participants: isUnregistering
            ? oldParticipantCount - 1
            : oldParticipantCount + 1,
        },
      };

      getParticipationReportByTime();
      setUserMealParticipations([
        ...enhancedMealEvents.slice(0, indexOfUpdatedMeal),
        { ...newMeal },
        ...enhancedMealEvents.slice(indexOfUpdatedMeal + 1),
      ]);
      setMealEvents([
        ...enhancedMealEvents.slice(0, indexOfUpdatedMeal),
        { ...newMeal },
        ...enhancedMealEvents.slice(indexOfUpdatedMeal + 1),
      ]);
    },
    [enhancedMealEvents],
  );
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        await Promise.all([
          getParticipationReportByTime(),
          address ? getIsAdmin() : Promise.resolve(false),
          address ? getIsAllowedUser() : Promise.resolve(false),
          getEventsInfosByTime(),
          address ? getUserEventsByTime() : Promise.resolve([]),
        ]);

        setLoadingAllEvents(false);
        if (address) {
          setSuccessFetchingUserEvents(true);
        }
      } catch (e) {
        console.log('Caught an error while fetching meal events:', e);
      }
    };

    if (!isConnecting) {
      fetchContractData();
    }
  }, [address, isConnecting]);

  const futureMeals: Meal[] =
    enhancedMealEvents
      ?.filter(
        mealEvent => Number(mealEvent.info.time.seconds) * 1000 > Date.now(),
      )
      .slice(0, 7) ?? [];
  const pastMeals =
    enhancedMealEvents?.filter(
      mealEvent => Number(mealEvent.info.time.seconds) * 1000 <= Date.now(),
    ) ?? [];

  return {
    isAdmin,
    pastMeals,
    foodieRank,
    futureMeals,
    isAllowedUser,
    allTimeMealCount,
    loadingAllEvents,
    isSuccessFetchingUserEvents,
    updateMeal,
    setSuccessFetchingUserEvents,
  };
};

const addUserParticipationToMealEvents = (
  mealEvents: Meal[],
  userMealEvents: Meal[],
) => {
  if (!userMealEvents?.length) {
    return mealEvents ?? [];
  } else {
    return mealEvents?.map(meal => {
      return {
        ...meal,
        info: {
          ...meal.info,
          registered: !!userMealEvents?.find(
            ({ id, info: { registered } }) => meal.id === id && registered,
          ),
        },
      };
    });
  }
};

const extractGlobalStatsFromReport = (
  walletReport: { user: BigInt; n_participations: BigInt }[],
  user: string,
) => {
  const foodieRank =
    walletReport
      .sort(
        (
          { n_participations: nParticipationsUserA },
          { n_participations: nParticipationsUserB },
        ) => (nParticipationsUserA < nParticipationsUserB ? 1 : -1),
      )
      .findIndex(({ user: trimmedUserAddress }) =>
        user.includes(trimmedUserAddress.toString(16)),
      ) + 1;
  const allTimeMealCount = Number(
    walletReport.find(({ user: trimmedUserAddress }) =>
      user.includes(trimmedUserAddress.toString(16)),
    )?.n_participations ?? 0,
  );

  return {
    foodieRank,
    allTimeMealCount,
  };
};
