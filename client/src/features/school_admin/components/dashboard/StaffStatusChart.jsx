import { Cell, Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { COMMON } from '@/lib/icons';

const chartConfig = {
  active: { label: 'Active', color: 'var(--chart-2)' },
  inactive: { label: 'Inactive', color: 'var(--chart-5)' },
};

const StaffStatusChart = ({ active = 0, inactive = 0, isLoading }) => {
  const total = active + inactive;
  // `name` must match the chartConfig keys so legend/tooltip resolve labels.
  const data = [
    { name: 'active', value: active, fill: 'var(--color-active)' },
    { name: 'inactive', value: inactive, fill: 'var(--color-inactive)' },
  ];

  return (
    <Card className="border-border bg-card flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Staff Status</CardTitle>
        <CardDescription>Active vs inactive members</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="mx-auto h-65 w-full" />
        ) : total === 0 ? (
          <div className="text-muted-foreground flex h-65 flex-col items-center justify-center gap-2 text-center text-sm">
            <COMMON.USERS_GROUP className="size-8 opacity-40" />
            No staff yet
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-65"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={4}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !('cx' in viewBox)) return null;
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffStatusChart;
