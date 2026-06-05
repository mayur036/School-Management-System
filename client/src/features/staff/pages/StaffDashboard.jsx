import { useAuth } from '@/hooks/useAuth';

const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome, {user?.first_name}
      </h1>
      <p className="text-muted-foreground text-sm">
        Staff home — your tasks and notifications will appear here.
      </p>
    </div>
  );
};

export default StaffDashboard;
