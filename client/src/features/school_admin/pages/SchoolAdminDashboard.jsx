import { useMemo } from 'react';

import WelcomeBanner from '@/components/shared/WelcomeBanner';

import QuickActions from '../components/dashboard/QuickActions';
import RecentStaff from '../components/dashboard/RecentStaff';
import SchoolAdminStatCard from '../components/dashboard/SchoolAdminStatCard';
import StaffByDepartmentChart from '../components/dashboard/StaffByDepartmentChart';
import StaffStatusChart from '../components/dashboard/StaffStatusChart';
import { useGetDepartmentsQuery } from '../departments.api';
import { useGetStaffQuery } from '../staff.api';
import {
  computeStaffStats,
  getRecentStaff,
  groupStaffByDepartmentName,
} from '../utils/staff.utils';

export const SchoolAdminDashboard = () => {
  const { data: staffData, isLoading: staffLoading } = useGetStaffQuery();
  const { data: deptData, isLoading: deptLoading } = useGetDepartmentsQuery();
  const isLoading = staffLoading || deptLoading;

  const staff = useMemo(() => staffData?.data?.staff ?? [], [staffData]);
  const departments = useMemo(
    () => deptData?.data?.departments ?? [],
    [deptData]
  );

  const stats = useMemo(
    () => computeStaffStats(staff, departments),
    [staff, departments]
  );
  const byDepartment = useMemo(
    () => groupStaffByDepartmentName(staff, departments),
    [staff, departments]
  );
  const recentStaff = useMemo(() => getRecentStaff(staff), [staff]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* KPI cards */}
      <SchoolAdminStatCard stats={stats} isLoading={isLoading} />

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
