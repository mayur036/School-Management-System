import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

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
            <EMPTY_STATE.NO_DATA className="size-8 opacity-40" />
          </div>
          <p>No department data yet</p>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-65 w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: -16, right: 16, top: 12, bottom: 0 }}
          >
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
              cursor={{ fill: 'var(--color-muted)', opacity: 0.15 }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count > 0 ? '#6366f1' : '#e2e8f0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </CardContent>
  </Card>
);

export default StaffByDepartmentChart;
