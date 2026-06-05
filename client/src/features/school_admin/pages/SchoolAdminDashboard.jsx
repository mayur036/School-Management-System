import { Briefcase, FolderTree, Plus, UserCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const DEPARTMENTS = [
  { name: 'Mathematics & Science', staffCount: 12, pct: 40 },
  { name: 'Languages & Literature', staffCount: 8, pct: 26 },
  { name: 'Social Studies & Arts', staffCount: 6, pct: 20 },
  { name: 'Administration & HR', staffCount: 4, pct: 14 },
];

const RECENT_STAFF = [
  {
    name: 'Jane Miller',
    email: 'j.miller@school.com',
    role: 'Teacher',
    dept: 'Languages & Literature',
  },
  {
    name: 'David Wilson',
    email: 'd.wilson@school.com',
    role: 'Teacher',
    dept: 'Mathematics & Science',
  },
  {
    name: 'Sarah Connor',
    email: 's.connor@school.com',
    role: 'Clerk',
    dept: 'Administration & HR',
  },
];

export const SchoolAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {user?.first_name || 'Admin'}
          </h1>
          <p className="text-muted-foreground text-sm">
            School administration and resource command center.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/school/departments">
              <FolderTree className="mr-2 h-4 w-4" />
              Departments
            </Link>
          </Button>
          <Button asChild>
            <Link to="/school/staff/register">
              <Plus className="mr-2 h-4 w-4" />
              Register Staff
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Departments
            </CardTitle>
            <FolderTree className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Active academic & admin units
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Registered Staff
            </CardTitle>
            <Users className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-muted-foreground mt-1 text-xs">
              +3 onboarded this term
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Active Staff
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-muted-foreground mt-1 text-xs">
              93.3% system engagement rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Support Staff
            </CardTitle>
            <Briefcase className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Accounts, IT, and maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-7">
        {/* Department Breakdown */}
        <Card className="border-border/60 md:col-span-3 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Department Breakdown
            </CardTitle>
            <CardDescription>
              Staff counts by organizational department.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEPARTMENTS.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-muted-foreground">
                    {dept.staffCount} Staff ({dept.pct}%)
                  </span>
                </div>
                <div className="bg-secondary h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Staff Activity */}
        <Card className="border-border/60 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Registrations
              </CardTitle>
              <CardDescription>Newly added department staff.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/school/staff">View Directory</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_STAFF.map((staff, i) => (
                <div
                  key={i}
                  className="border-border/40 hover:bg-muted/5 flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors"
                >
                  <div className="flex min-w-0 flex-col">
                    <p className="truncate text-sm leading-none font-semibold">
                      {staff.name}
                    </p>
                    <p className="text-muted-foreground mt-1 truncate text-xs">
                      {staff.email}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-medium">{staff.role}</span>
                    <p className="text-muted-foreground text-xxs mt-0.5">
                      {staff.dept}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
