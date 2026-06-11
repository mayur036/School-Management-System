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
import { BASE } from '@/lib/icons';

const chartConfig = {
  active: { label: 'Active Staff', color: '#10b981' },
  inactive: { label: 'Inactive Staff', color: '#f43f5e' },
};

const StaffStatusChart = ({ active = 0, inactive = 0, isLoading }) => {
  const total = active + inactive;
  const data = [
    { name: 'active', value: active, fill: 'url(#activeGrad)' },
    { name: 'inactive', value: inactive, fill: 'url(#inactiveGrad)' },
  ];

  return (
    <Card className="border-border bg-card flex flex-col shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-bold">Account Status</CardTitle>
        <CardDescription>Active vs inactive members</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
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
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-65"
          >
            <PieChart>
              <defs>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="inactiveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                strokeWidth={0}
                cornerRadius={8}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.name === 'active' ? 'url(#activeGrad)' : 'url(#inactiveGrad)'} 
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
                          className="fill-foreground text-4xl font-black tracking-tighter"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 24}
                          className="fill-muted-foreground text-xs font-semibold uppercase tracking-widest"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <ChartLegend 
                content={<ChartLegendContent nameKey="name" />} 
                className="-translate-y-2 flex-wrap justify-center gap-4"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffStatusChart;
