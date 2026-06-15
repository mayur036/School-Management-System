import { useEffect, useState } from 'react';
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
import { useForgotPasswordMutation } from '@/features/auth/auth.api';
import { useAuth } from '@/hooks/useAuth';
import { BASE } from '@/lib/icons';

import { useChangePasswordMutation } from '../profile.api';

export const ChangePasswordDialog = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const [forgotPassword] = useForgotPasswordMutation();
  const [isSendingForgotLink, setIsSendingForgotLink] = useState(false);

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleForgotPassword = async () => {
    if (!user?.email) {
      toast.error('User email not found');
      return;
    }
    setIsSendingForgotLink(true);
    try {
      await forgotPassword({ email: user.email }).unwrap();
      toast.success('A password reset link has been sent to your email.');
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to send password reset email');
    } finally {
      setIsSendingForgotLink(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  }, [open]);

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();
      onOpenChange(false);
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update password');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Account Password</DialogTitle>
          <DialogDescription>
            Provide your current password to authorize this action.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSavePassword} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="currentPass" className="text-xs font-semibold">
                Current Password
              </Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSendingForgotLink}
                className="text-primary cursor-pointer text-[11px] font-medium hover:underline"
              >
                {isSendingForgotLink ? 'Sending link...' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <Input
                id="currentPass"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-lg pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-muted-foreground/60 hover:text-foreground absolute inset-y-0 right-3 flex cursor-pointer items-center"
              >
                {showCurrentPassword ? (
                  <BASE.EYE_OFF className="size-4" />
                ) : (
                  <BASE.EYE className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPass" className="text-xs font-semibold">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPass"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-lg pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-muted-foreground/60 hover:text-foreground absolute inset-y-0 right-3 flex cursor-pointer items-center"
              >
                {showNewPassword ? (
                  <BASE.EYE_OFF className="size-4" />
                ) : (
                  <BASE.EYE className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPass" className="text-xs font-semibold">
              Confirm New Password
            </Label>
            <Input
              id="confirmPass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-lg text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer rounded-xl text-xs sm:text-sm"
            >
              {isChangingPassword && (
                <BASE.LOADER className="mr-2 size-3 animate-spin" />
              )}
              Update Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
