import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BASE } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { editProfileSchema } from '@/schemas/profile.schema';

import {
  languagePreference,
  timezonePreference,
} from '../constants/profile.constants';
import { useUpdateProfileMutation } from '../profile.api';

export const EditProfileDialog = ({
  open,
  onOpenChange,
  user,
  bio,
  timezone,
  language,
  onSuccess,
}) => {
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      bio: '',
      timezone: '',
      language: '',
    },
  });

  useEffect(() => {
    if (open && user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        bio: bio || '',
        timezone: timezone || '',
        language: language || '',
      });
    }
  }, [open, user, bio, timezone, language, reset]);

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        phone: data.phone.trim() || null,
      }).unwrap();

      onSuccess({
        bio: data.bio.trim(),
        timezone: data.timezone,
        language: data.language,
      });

      onOpenChange(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile Information</DialogTitle>
          <DialogDescription>
            Update your account details. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-xs font-semibold">
                First Name
              </Label>
              <Input
                id="firstName"
                className={cn(
                  'rounded-lg text-xs',
                  errors.first_name && 'border-destructive'
                )}
                placeholder="First Name"
                {...register('first_name')}
              />
              {errors.first_name && (
                <p className="text-destructive text-[10px]">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-xs font-semibold">
                Last Name
              </Label>
              <Input
                id="lastName"
                className={cn(
                  'rounded-lg text-xs',
                  errors.last_name && 'border-destructive'
                )}
                placeholder="Last Name"
                {...register('last_name')}
              />
              {errors.last_name && (
                <p className="text-destructive text-[10px]">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs font-semibold">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+91 XXXXX XXXXX"
              className={cn(
                'rounded-lg text-xs',
                errors.phone && 'border-destructive'
              )}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-destructive text-[10px]">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Local-only preference fields (not yet persisted server-side) */}
          <div className="space-y-1">
            <Label htmlFor="bio" className="text-xs font-semibold">
              About / Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className={cn(
                'min-h-16 rounded-lg text-xs',
                errors.bio && 'border-destructive'
              )}
              {...register('bio')}
            />
            {errors.bio && (
              <p className="text-destructive text-[10px]">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="text-xs font-semibold">
                Time Zone
              </Label>
              <Controller
                control={control}
                name="timezone"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="timezone"
                      className={cn(
                        'w-full text-xs',
                        errors.timezone && 'border-destructive'
                      )}
                    >
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezonePreference.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.timezone && (
                <p className="text-destructive text-[10px]">
                  {errors.timezone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="language" className="text-xs font-semibold">
                Language
              </Label>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="language"
                      className={cn(
                        'w-full text-xs',
                        errors.language && 'border-destructive'
                      )}
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languagePreference.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language && (
                <p className="text-destructive text-[10px]">
                  {errors.language.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer rounded-xl text-xs sm:text-sm"
            >
              {isUpdatingProfile && (
                <BASE.LOADER className="mr-2 size-3 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
