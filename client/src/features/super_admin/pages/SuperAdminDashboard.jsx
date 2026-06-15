import { useMemo } from 'react';

import WelcomeBanner from '@/components/shared/WelcomeBanner';

import RecentSchools from '../components/dashboard/RecentSchools';
import SchoolsGrowthChart from '../components/dashboard/SchoolsGrowthChart';
import SchoolsStatusChart from '../components/dashboard/SchoolsStatusChart';
import SuperAdminQuickActions from '../components/dashboard/SuperAdminQuickActions';
import SuperAdminStatCards from '../components/dashboard/SuperAdminStatCards';
import { useGetSchoolAdminsQuery } from '../schoolAdmins.api';
import { useGetSchoolsQuery } from '../schools.api';
import {
  computeSuperAdminStats,
  getRecentSchools,
  groupSchoolsByMonth,
} from '../utils/dashboard.utils';

export const SuperAdminDashboard = () => {
  const { data: schoolsData, isLoading: schoolsLoading } = useGetSchoolsQuery();
  const { data: adminsData, isLoading: adminsLoading } =
    useGetSchoolAdminsQuery();

  const isLoading = schoolsLoading || adminsLoading;

  const schools = useMemo(
    () => schoolsData?.data?.schools ?? [],
    [schoolsData]
  );
  const admins = useMemo(() => adminsData?.data?.admins ?? [], [adminsData]);

  const stats = useMemo(
    () => computeSuperAdminStats(schools, admins),
    [schools, admins]
  );
  const schoolsByMonth = useMemo(() => groupSchoolsByMonth(schools), [schools]);
  const recentSchools = useMemo(() => getRecentSchools(schools), [schools]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* KPI cards */}
      <SuperAdminStatCards stats={stats} isLoading={isLoading} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SchoolsGrowthChart data={schoolsByMonth} isLoading={isLoading} />
        </div>
        <SchoolsStatusChart
          active={stats.activeSchools}
          inactive={stats.inactiveSchools}
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions & Recent Schools */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SuperAdminQuickActions />
        <div className="lg:col-span-2">
          <RecentSchools schools={recentSchools} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
