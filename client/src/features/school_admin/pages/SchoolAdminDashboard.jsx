import PagePlaceholder from '@/components/shared/PagePlaceholder';
import { useAuth } from '@/hooks/useAuth';
import { SCHOOL_ADMIN } from '@/lib/icons';

export const SchoolAdminDashboard = () => {
  const { user } = useAuth();
  console.log(user);
  return <PagePlaceholder title="Dashboard" Icon={SCHOOL_ADMIN.DASHBOARD} />;
};

export default SchoolAdminDashboard;
