import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { EMPTY_STATE } from '@/lib/icons';

const chartConfig = {
  count: { label: 'Schools Onboarded', color: 'var(--chart-1)' },
};

export const SchoolsGrowthChart = ({ data = [], isLoading }) => {
  return (
    <Card className="border-border bg-card flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Schools Onboarded</CardTitle>
        <CardDescription>Schools created by month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="h-65 w-full" />
        ) : data.length === 0 ? (
          <div className="text-muted-foreground flex h-65 flex-col items-center justify-center gap-2 text-center text-sm">
            <EMPTY_STATE.NO_DATA className="size-8 opacity-40" />
            No school data yet
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-65 w-full"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ left: 0, right: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolsGrowthChart;
