import { useMemo } from 'react';
import { Ad } from '../types/ad';
import { adCountByDay } from '../utils/date';

export const useMonthlyStats = ({
  adsGroupedByMonth,
}: {
  adsGroupedByMonth: Record<string, Ad[]>;
}) => {
  return useMemo(
    () =>
      Object.entries(adsGroupedByMonth).map(([month, ads]) => ({
        month,
        adsByDay: adCountByDay(ads),
      })),
    [adsGroupedByMonth],
  );
};
