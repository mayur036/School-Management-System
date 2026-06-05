import { Camera, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

import { useUploadAvatarMutation } from './profile.api';

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  school_admin: 'School Administrator',
  staff: 'Department Staff',
};

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ProfileView = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  const initials =
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
    'U';

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still fires onChange.
    event.target.value = '';
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please choose a JPEG, PNG, or WEBP image');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('Image must be 2 MB or smaller');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await uploadAvatar(formData).unwrap();
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update avatar');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Account Settings</CardTitle>
          <CardDescription>
            Manage your profile photo and personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar + upload */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="size-24 border">
                <AvatarImage
                  src={user.avatar_url || undefined}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFile}
              />
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer gap-2"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
                {isLoading ? 'Uploading…' : 'Change photo'}
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                JPG, PNG or WEBP. Max 2 MB.
              </p>
            </div>

            {/* Identity */}
            <div className="w-full flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <Badge
                  className={
                    user.status === 'active'
                      ? 'bg-success text-success-foreground'
                      : 'bg-destructive text-destructive-foreground'
                  }
                >
                  {user.status}
                </Badge>
              </div>

              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Role
                  </dt>
                  <dd className="text-foreground mt-0.5 font-medium">
                    {ROLE_LABELS[user.role_name] ?? user.role_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Email
                  </dt>
                  <dd className="text-foreground mt-0.5 font-medium break-all">
                    {user.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Phone
                  </dt>
                  <dd className="text-foreground mt-0.5 font-medium">
                    {user.phone || 'Not provided'}
                  </dd>
                </div>
                {user.department_name && (
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Department
                    </dt>
                    <dd className="text-foreground mt-0.5 font-medium">
                      {user.department_name}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
