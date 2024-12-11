import { Trophy, Utensils } from 'lucide-react';
import { MonthlyStats } from '../../types/stats';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
];

export const StatsCard = ({
  stats,
  foodieRank,
  allTimeMealCount,
}: {
  stats?: MonthlyStats;
  foodieRank?: number;
  allTimeMealCount?: number;
}) => {
  if (!stats) {
    return null;
  }

  const pieData = Object.entries(stats?.mealsByDay).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Meal Count
            </p>
            <div className="flex items-center space-x-2">
              <Utensils className="h-6 w-6 text-primary" />
              <p className="text-2xl font-bold">{allTimeMealCount}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Foodie Rank
            </p>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <p className="text-2xl font-bold">{foodieRank}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Meals by Day of Week
          </p>
          <div className="h-64">
            {allTimeMealCount ? (
              <ChartContainer
                config={{
                  mealsByDay: {
                    label: 'Meals by Day',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-sm font-medium">No Meals Found</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
