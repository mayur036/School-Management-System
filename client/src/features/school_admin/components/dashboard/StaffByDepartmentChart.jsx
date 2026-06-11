import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
  count: { label: 'Staff Members', color: '#6366f1' }, // Indigo-500
};

const StaffByDepartmentChart = ({ data = [], isLoading }) => (
  <Card className="border-border bg-card flex flex-col shadow-sm">
    <CardHeader className="pb-4">
      <CardTitle className="text-base font-bold">Staff Distribution</CardTitle>
      <CardDescription>Headcount across each department</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      {isLoading ? (
        <Skeleton className="h-65 w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="text-muted-foreground flex h-65 flex-col items-center justify-center gap-3 text-center text-sm">
          <div className="bg-muted rounded-full p-4">
            <SCHOOL_ADMIN.DEPARTMENTS className="size-8 opacity-40" />
          </div>
          <p>No department data yet</p>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-65 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: -16, right: 16, top: 12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.3}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={12}
              tickFormatter={(v) => (v.length > 12 ? `${v.slice(0, 12)}…` : v)}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <ChartTooltip
              cursor={{
                stroke: '#6366f1',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#fillCount)"
              activeDot={{
                r: 6,
                fill: '#6366f1',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </CardContent>
  </Card>
);

export default StaffByDepartmentChart;
