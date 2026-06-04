import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLogoutMutation } from '@/features/auth/auth.api';
import { useAuth } from '@/hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials =
    `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() ||
    'U';
  const roleLabels = {
    super_admin: 'Super Administrator',
    school_admin: 'School Administrator',
    staff: 'Department Staff',
  };

  if (!user) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="dark:via-background flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50/50 via-white to-sky-50/50 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-2xl">
        <Card className="border-muted/80 border shadow-xl">
          <CardHeader className="relative pb-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
              <Avatar className="border-primary/20 h-20 w-20 border-2">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <CardTitle className="text-2xl font-bold">
                    {user.first_name} {user.last_name}
                  </CardTitle>
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                  >
                    {user.status}
                  </Badge>
                </div>
                <CardDescription className="text-primary/80 text-base font-medium">
                  {roleLabels[user.role_name] || user.role_name}
                </CardDescription>
                <CardDescription className="text-sm">
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  User ID
                </p>
                <p className="text-sm font-medium">{user.staff_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Contact Phone
                </p>
                <p className="text-sm font-medium">
                  {user.phone || 'Not provided'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  School
                </p>
                <p className="text-sm font-medium">
                  {user.school_id
                    ? `School ID: ${user.school_id}`
                    : 'Platform Level (Super Admin)'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Department
                </p>
                <p className="text-sm font-medium">
                  {user.department_name
                    ? user.department_name
                    : user.department_id
                      ? `Dept ID: ${user.department_id}`
                      : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 flex flex-col gap-3 border-t sm:flex-row sm:justify-between">
            <p className="text-muted-foreground text-xs">
              Connected securely via cookies session
            </p>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
