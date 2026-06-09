import { useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';

import QuickActions from '../components/dashboard/QuickActions';
import RecentStaff from '../components/dashboard/RecentStaff';
import StaffByDepartmentChart from '../components/dashboard/StaffByDepartmentChart';
import StaffStatusChart from '../components/dashboard/StaffStatusChart';
import StatCards from '../components/dashboard/StatCards';
import { useGetDepartmentsQuery } from '../departments.api';
import { useGetStaffQuery } from '../staff.api';

export const SchoolAdminDashboard = () => {
  const { user } = useAuth();

  const { data: staffData, isLoading: staffLoading } = useGetStaffQuery();
  const { data: deptData, isLoading: deptLoading } = useGetDepartmentsQuery();
  const isLoading = staffLoading || deptLoading;

  const staff = useMemo(() => staffData?.data?.staff ?? [], [staffData]);
  const departments = useMemo(
    () => deptData?.data?.departments ?? [],
    [deptData]
  );

  // ── Derived stats (client-side, mirrors StaffPage) ────────────
  const stats = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.status === 'active').length;
    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;

    const now = new Date();
    const joinedThisMonth = staff.filter((s) => {
      if (!s.created_at) return false;
      const d = new Date(s.created_at);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      total,
      active,
      inactive: total - active,
      activePct,
      deptsCount: departments.length,
      joinedThisMonth,
    };
  }, [staff, departments]);

  // ── Staff grouped by department (sorted desc, capped to 8) ────
  const byDepartment = useMemo(() => {
    const counts = departments.map((d) => ({
      name: d.name,
      count: staff.filter((s) => s.department_name === d.name).length,
    }));
    const unassigned = staff.filter((s) => !s.department_name).length;
    if (unassigned > 0) counts.push({ name: 'Unassigned', count: unassigned });
    return counts.sort((a, b) => b.count - a.count).slice(0, 8);
  }, [staff, departments]);

  // ── 5 most recently added staff ───────────────────────────────
  const recentStaff = useMemo(
    () =>
      [...staff]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
    [staff]
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Greeting header */}
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back{user?.first_name ? `, ${user.first_name}` : ''} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here's an overview of your school's staff and departments.
        </p>
      </div>

      {/* KPI cards */}
      <StatCards stats={stats} isLoading={isLoading} />

      {/* Charts: bar (span 2) + donut */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StaffByDepartmentChart data={byDepartment} isLoading={isLoading} />
        </div>
        <StaffStatusChart
          active={stats.active}
          inactive={stats.inactive}
          isLoading={isLoading}
        />
      </div>

      {/* Quick actions + recent staff (span 2) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <QuickActions />
        <div className="lg:col-span-2">
          <RecentStaff staff={recentStaff} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
