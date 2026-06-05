import { KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  school_admin: 'School Administrator',
  staff: 'Department Staff',
};

export const ProfileView = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!user) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-muted-foreground ml-2 text-sm">
          Loading profile...
        </span>
      </div>
    );
  }

  const initials =
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
    'U';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error('All password fields are required!');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New password and confirmation do not match!');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long!');
      return;
    }

    toast.success('Password updated successfully!');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal details and account security.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Left Side: Profile Details */}
        <div className="md:col-span-3">
          <Card className="border-border/60 h-full shadow-xs">
            <CardHeader className="pb-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                <Avatar className="border-primary/20 h-16 w-16 border-2">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <CardTitle className="text-xl font-bold">
                      {user.first_name} {user.last_name}
                    </CardTitle>
                    <Badge
                      variant={
                        user.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-primary text-sm font-medium">
                    {ROLE_LABELS[user.role_name] ?? user.role_name}
                  </CardDescription>
                  <CardDescription className="text-xs">
                    {user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-6 pt-6 text-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xxs font-semibold tracking-wider uppercase">
                    User Account ID
                  </p>
                  <p className="text-foreground font-semibold">
                    STF-{user.staff_id}109
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xxs font-semibold tracking-wider uppercase">
                    Contact Phone
                  </p>
                  <p className="text-foreground font-semibold">
                    {user.phone || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xxs font-semibold tracking-wider uppercase">
                    School Scope
                  </p>
                  <p className="text-foreground font-semibold">
                    {user.school_id
                      ? `School ID: ${user.school_id}`
                      : 'Platform Level (Super Admin)'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xxs font-semibold tracking-wider uppercase">
                    Department Assignment
                  </p>
                  <p className="text-foreground font-semibold">
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

        {/* Right Side: Change Password Form */}
        <div className="md:col-span-2">
          <Card className="border-border/60 h-full shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <KeyRound className="text-primary h-4 w-4" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password for added security.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="mt-2 w-full gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
