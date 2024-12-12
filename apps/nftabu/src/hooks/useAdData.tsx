import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ad } from '../types/ad';
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

/// Various hooks to interact with the ad contract.
export const useAdData = () => {
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
  const { data: rawAdEvents, refetch: getEventsInfosByTime } =
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
  const { data: rawUserAdParticipations, refetch: getUserEventsByTime } =
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
  const [userAdParticipations, setUserAdParticipations] = useState<Ad[]>(
    [],
  );
  const [adEvents, setAdEvents] = useState<Ad[]>([]);

  useEffect(() => setAdEvents(rawAdEvents), [rawAdEvents]);
  useEffect(
    () => setUserAdParticipations(rawUserAdParticipations),
    [rawUserAdParticipations],
  );

  const { foodieRank, allTimeAdCount } = address
    ? extractGlobalStatsFromReport(allTimeReportResponse ?? [], address)
    : { foodieRank: 0, allTimeAdCount: 0 };

  const enhancedAdEvents = useMemo(
    () => addUserParticipationToAdEvents(adEvents, userAdParticipations),
    [adEvents, userAdParticipations],
  );

  const updateAd = useCallback(
    async (adId: string) => {
      const indexOfUpdatedAd = enhancedAdEvents
        .map(ad => ad.id)
        .indexOf(adId);
      const oldAd = enhancedAdEvents[indexOfUpdatedAd];

      const oldParticipantCount = Number(oldAd.info.number_of_participants);
      const isUnregistering = oldAd.info.registered;
      const newAd: Ad = {
        ...oldAd,
        info: {
          ...oldAd.info,
          registered: !oldAd.info.registered,
          number_of_participants: isUnregistering
            ? oldParticipantCount - 1
            : oldParticipantCount + 1,
        },
      };

      getParticipationReportByTime();
      setUserAdParticipations([
        ...enhancedAdEvents.slice(0, indexOfUpdatedAd),
        { ...newAd },
        ...enhancedAdEvents.slice(indexOfUpdatedAd + 1),
      ]);
      setAdEvents([
        ...enhancedAdEvents.slice(0, indexOfUpdatedAd),
        { ...newAd },
        ...enhancedAdEvents.slice(indexOfUpdatedAd + 1),
      ]);
    },
    [enhancedAdEvents],
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
        console.log('Caught an error while fetching ad events:', e);
      }
    };

    if (!isConnecting) {
      fetchContractData();
    }
  }, [address, isConnecting]);

  const futureAds: Ad[] =
    enhancedAdEvents
      ?.filter(
        adEvent => Number(adEvent.info.time.seconds) * 1000 > Date.now(),
      )
      .slice(0, 7) ?? [];
  const pastAds =
    enhancedAdEvents?.filter(
      adEvent => Number(adEvent.info.time.seconds) * 1000 <= Date.now(),
    ) ?? [];

  return {
    isAdmin,
    pastAds,
    foodieRank,
    futureAds,
    isAllowedUser,
    allTimeAdCount,
    loadingAllEvents,
    isSuccessFetchingUserEvents,
    updateAd,
    setSuccessFetchingUserEvents,
  };
};

const addUserParticipationToAdEvents = (
  adEvents: Ad[],
  userAdEvents: Ad[],
) => {
  if (!userAdEvents?.length) {
    return adEvents ?? [];
  } else {
    return adEvents?.map(ad => {
      return {
        ...ad,
        info: {
          ...ad.info,
          registered: !!userAdEvents?.find(
            ({ id, info: { registered } }) => ad.id === id && registered,
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
  const allTimeAdCount = Number(
    walletReport.find(({ user: trimmedUserAddress }) =>
      user.includes(trimmedUserAddress.toString(16)),
    )?.n_participations ?? 0,
  );

  return {
    foodieRank,
    allTimeAdCount,
  };
};
