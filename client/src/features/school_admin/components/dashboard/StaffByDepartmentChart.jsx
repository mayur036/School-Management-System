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
import { SCHOOL_ADMIN } from '@/lib/icons';

const chartConfig = {
  count: { label: 'Staff', color: 'var(--chart-1)' },
};

const StaffByDepartmentChart = ({ data = [], isLoading }) => (
  <Card className="border-border bg-card flex flex-col">
    <CardHeader>
      <CardTitle className="text-base">Staff by Department</CardTitle>
      <CardDescription>Headcount across each department</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      {isLoading ? (
        <Skeleton className="h-65 w-full" />
      ) : data.length === 0 ? (
        <div className="text-muted-foreground flex h-65 flex-col items-center justify-center gap-2 text-center text-sm">
          <SCHOOL_ADMIN.DEPARTMENTS className="size-8 opacity-40" />
          No department data yet
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-65 w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 4, right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v.length > 14 ? `${v.slice(0, 14)}…` : v)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      )}
    </CardContent>
  </Card>
);

export default StaffByDepartmentChart;
