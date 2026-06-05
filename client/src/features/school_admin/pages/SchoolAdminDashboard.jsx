import { useAuth } from '@/hooks/useAuth';

const SchoolAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome, {user?.first_name}
      </h1>
      <p className="text-muted-foreground text-sm">
        School Admin dashboard — departments and staff management coming next.
      </p>
    </div>
  );
};

export default SchoolAdminDashboard;
