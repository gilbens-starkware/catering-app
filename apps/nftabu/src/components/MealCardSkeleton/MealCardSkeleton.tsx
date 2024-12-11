import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const MealCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-full mb-2" />
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);
