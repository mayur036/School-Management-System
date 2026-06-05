import {
  Activity,
  Building2,
  Calendar,
  CheckCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const RECENT_SCHOOLS = [
  {
    name: 'Greenwood International School',
    code: 'GWIS',
    date: 'June 01, 2026',
    status: 'active',
  },
  {
    name: 'Oakridge Academy',
    code: 'OAKR',
    date: 'May 28, 2026',
    status: 'active',
  },
  {
    name: 'Pinecrest High School',
    code: 'PINE',
    date: 'May 20, 2026',
    status: 'inactive',
  },
];

export const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground text-sm">
          EduManage central administration panel.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Schools
            </CardTitle>
            <Building2 className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground mt-1 text-xs">
              +2 registered this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Active Tenants
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-muted-foreground mt-1 text-xs">
              83% active subscription rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Staff Accounts
            </CardTitle>
            <Users className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Across all school tenants
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Platform Status
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
            <p className="text-muted-foreground mt-1 text-xs">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-7">
        {/* Growth Chart */}
        <Card className="border-border/60 md:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Tenant Registrations
            </CardTitle>
            <CardDescription>
              School onboardings by month (2026).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-60 flex-col justify-end">
            <div className="flex h-full items-end justify-between gap-4 px-2 pt-4">
              {/* Jan */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bg-primary/20 hover:bg-primary/30 h-[20%] w-full rounded-t-md transition-all"
                  title="2 Schools"
                />
                <span className="text-muted-foreground text-xs">Jan</span>
              </div>
              {/* Feb */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bg-primary/20 hover:bg-primary/30 h-[40%] w-full rounded-t-md transition-all"
                  title="4 Schools"
                />
                <span className="text-muted-foreground text-xs">Feb</span>
              </div>
              {/* Mar */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bg-primary/20 hover:bg-primary/30 h-[30%] w-full rounded-t-md transition-all"
                  title="3 Schools"
                />
                <span className="text-muted-foreground text-xs">Mar</span>
              </div>
              {/* Apr */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bg-primary/20 hover:bg-primary/30 h-[60%] w-full rounded-t-md transition-all"
                  title="6 Schools"
                />
                <span className="text-muted-foreground text-xs">Apr</span>
              </div>
              {/* May */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bg-primary/20 hover:bg-primary/30 h-[80%] w-full rounded-t-md transition-all"
                  title="8 Schools"
                />
                <span className="text-muted-foreground text-xs">May</span>
              </div>
              {/* Jun */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="bg-primary h-full w-full rounded-t-md"
                  title="12 Schools"
                />
                <span className="text-foreground text-xs font-medium">Jun</span>
              </div>
            </div>
            <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-xs">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>
                School onboarding has increased by 50% over the last quarter
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Schools */}
        <Card className="border-border/60 md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Onboarded Recently
              </CardTitle>
              <CardDescription>Recent registrations.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/super/schools">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_SCHOOLS.map((school, i) => (
                <div
                  key={i}
                  className="border-border/40 hover:bg-muted/5 flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/5 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm leading-none font-semibold">
                        {school.name}
                      </p>
                      <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" /> {school.date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      school.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {school.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
