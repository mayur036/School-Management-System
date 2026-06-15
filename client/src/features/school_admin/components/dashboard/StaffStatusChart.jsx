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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE } from '@/lib/icons';

const chartConfig = {
  active: { label: 'Active Staff', color: 'var(--color-success)' },
  inactive: { label: 'Inactive Staff', color: 'var(--color-neutral)' },
};

const StaffStatusChart = ({ active = 0, inactive = 0, isLoading }) => {
  const total = active + inactive;
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const inactivePercent = total > 0 ? 100 - activePercent : 0;

  const data = [
    { name: 'active', value: active, fill: 'var(--color-success)' },
    { name: 'inactive', value: inactive, fill: 'var(--color-neutral)' },
  ];

  return (
    <Card className="border-border bg-card flex flex-col shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-bold">Account Status</CardTitle>
        <CardDescription>Active vs inactive members</CardDescription>
      </CardHeader>
      <CardContent className="flex grow flex-col justify-between pb-4">
        {isLoading ? (
          <Skeleton className="mx-auto mt-4 h-56 w-full rounded-full" />
        ) : total === 0 ? (
          <div className="text-muted-foreground flex h-65 flex-col items-center justify-center gap-3 text-center text-sm">
            <div className="bg-muted rounded-full p-4">
              <BASE.USERS className="size-8 opacity-40" />
            </div>
            <p>No staff yet</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-between">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-56"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={78}
                  paddingAngle={4}
                  strokeWidth={0}
                  cornerRadius={6}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === 'active'
                          ? 'var(--color-success)'
                          : 'var(--color-neutral)'
                      }
                    />
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
                            y={viewBox.cy - 4}
                            className="fill-foreground text-3xl font-black tracking-tighter"
                          >
                            {total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy + 20}
                            className="fill-muted-foreground text-[10px] font-semibold tracking-widest uppercase"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Custom Legend showing exact percentage and counts */}
            <div className="border-border/50 flex items-center justify-center gap-6 border-t pt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-success inline-block h-2.5 w-2.5 shrink-0 rounded-full" />
                <span className="text-muted-foreground">Active</span>
                <span className="text-foreground font-bold">{active}</span>
                <span className="text-muted-foreground text-[10px]">
                  ({activePercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-neutral inline-block h-2.5 w-2.5 shrink-0 rounded-full" />
                <span className="text-muted-foreground">Inactive</span>
                <span className="text-foreground font-bold">{inactive}</span>
                <span className="text-muted-foreground text-[10px]">
                  ({inactivePercent}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffStatusChart;
