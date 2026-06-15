import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

export const WelcomeBanner = ({ description }) => {
  const { user } = useAuth();

  const dateStr = new Date().toLocaleDateString('en-US', { dateStyle: 'long' });
  const initials = getInitials(`${user?.first_name} ${user?.last_name || ''}`);

  // Format description dynamically based on role if not provided explicitly
  const displayDescription =
    description ||
    (user?.role_name === 'super_admin'
      ? "Here's an overview of the platform's schools and admins."
      : user?.role_name === 'school_admin'
        ? "Here's an overview of your school's staff and departments."
        : `${user?.department_name || 'Staff Member'} · ${
            user?.role_name === 'staff'
              ? 'Departmental Staff'
              : user?.role_name || ''
          }`);

  return (
    <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-300 hover:shadow-sm sm:p-6">
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="border-border h-14 w-14 border sm:h-16 sm:w-16">
            <AvatarImage
              src={user?.avatar_url}
              alt={`${user?.first_name} ${user?.last_name || ''}`}
            />
            <AvatarFallback className="bg-muted text-muted-foreground text-base font-semibold sm:text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {displayDescription}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-border bg-muted/20 text-muted-foreground px-3 py-1.5 text-xs font-semibold"
        >
          {dateStr}
        </Badge>
      </div>
    </div>
  );
};

export default WelcomeBanner;
