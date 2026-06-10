import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { COMMON } from '@/lib/icons';
import { copyToClipboard } from '@/lib/utils';
import { createSchoolAdminSchema } from '@/schemas/school.schema';

import { useCreateSchoolAdminMutation } from '../schools.api';

/**
 * Dialog to create a School Admin for a given school.
 *
 * After successful creation the dialog switches to a "credentials" view
 * so the super admin can copy the email + password before closing.
 *
 * Props:
 *   school  – { school_id, name } (null when closed)
 *   onClose – callback to clear the selected school
 */
const CreateSchoolAdminDialog = ({ school, onClose }) => {
  const [createAdmin, { isLoading }] = useCreateSchoolAdminMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchoolAdminSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const handleClose = useCallback(() => {
    reset();
    setCredentials(null);
    setShowPassword(false);
    setCopied(false);
    onClose();
  }, [reset, onClose]);

  const onSubmit = async (data) => {
    const payload = {
      schoolId: school.school_id,
      ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '')),
    };

    try {
      await createAdmin(payload).unwrap();
      toast.success('School admin created successfully');
      // Switch to credential display mode
      setCredentials({ email: data.email, password: data.password });
    } catch (err) {
      toast.error(err?.message ?? 'Failed to create school admin');
    }
  };

  const handleCopy = async () => {
    if (!credentials) return;
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;
    try {
      await copyToClipboard(text);
      setCopied(true);
      toast.success('Credentials copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy — please copy manually');
    }
  };

  if (!school) return null;

  return (
    <Dialog open={!!school} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {credentials ? 'Admin Created' : 'Add School Admin'}
          </DialogTitle>
          <DialogDescription>
            {credentials
              ? 'Share these credentials with the new admin securely.'
              : `Create an administrator account for ${school.name}.`}
          </DialogDescription>
        </DialogHeader>

        {/* ── Credential display (post-creation) ─────────────── */}
        {credentials ? (
          <div className="flex flex-col gap-4">
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Admin Credentials</CardTitle>
                  <Badge className="bg-success text-success-foreground">
                    New
                  </Badge>
                </div>
                <CardDescription>
                  For <strong>{school.name}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Email
                    </dt>
                    <dd className="text-foreground mt-0.5 font-mono font-medium">
                      {credentials.email}
                    </dd>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Password
                    </dt>
                    <dd className="text-foreground mt-0.5 font-mono font-medium">
                      {credentials.password}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer gap-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <COMMON.CHECK data-icon="inline-start" />
                ) : (
                  <COMMON.COPY data-icon="inline-start" />
                )}
                {copied ? 'Copied!' : 'Copy Credentials'}
              </Button>
              <Button className="cursor-pointer" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* ── Create admin form ──────────────────────────────── */
          <>
            <form
              id="create-admin-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* First + Last name */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-first-name">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="admin-first-name"
                    placeholder="John"
                    aria-invalid={!!errors.first_name}
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="text-destructive text-xs">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-last-name">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="admin-last-name"
                    placeholder="Doe"
                    aria-invalid={!!errors.last_name}
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p className="text-destructive text-xs">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="admin-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@school.edu"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-destructive text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password with toggle */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="admin-password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="pr-10"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? <COMMON.EYE_OFF /> : <COMMON.EYE />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="admin-phone">Phone</Label>
                <Input
                  id="admin-phone"
                  placeholder="+91 98765 43210"
                  aria-invalid={!!errors.phone}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-destructive text-xs">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </form>

            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-admin-form"
                className="cursor-pointer gap-2"
                disabled={isLoading}
              >
                {isLoading && <COMMON.LOADER className="animate-spin" />}
                {isLoading ? 'Creating…' : 'Create Admin'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchoolAdminDialog;
