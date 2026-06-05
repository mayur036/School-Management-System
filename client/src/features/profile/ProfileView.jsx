import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  school_admin: 'School Administrator',
  staff: 'Department Staff',
};

/**
 * Shared profile card. Rendered inside each role's own layout (so it inherits
 * that role's sidebar + header). Logout lives in the header, not here.
 */
const ProfileView = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-muted-foreground text-sm">Loading profile...</p>;
  }

  const initials =
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
    'U';

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card className="border-muted/80 border shadow-sm">
        <CardHeader className="pb-8">
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
                {ROLE_LABELS[user.role_name] ?? user.role_name}
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
      </Card>
    </div>
  );
};

export default ProfileView;
