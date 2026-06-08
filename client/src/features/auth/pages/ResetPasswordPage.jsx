import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPasswordMutation } from '@/features/auth/auth.api';
import { COMMON } from '@/lib/icons';
import { resetPasswordSchema } from '@/schemas/auth.schema';

const HIGHLIGHTS = [
  {
    Icon: COMMON.LOCK,
    title: 'Strong Password Security',
    subtitle: 'rules enforced to keep your account safe',
  },
  {
    Icon: COMMON.SHIELD_CHECK,
    title: 'Safe Password Hashing',
    subtitle: 'passwords are encrypted using bcrypt hashing',
  },
  {
    Icon: COMMON.CHECK,
    title: 'Instant Login Activation',
    subtitle: 'log back in immediately after updating',
  },
];

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordVal = watch('password', '');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error(
        'Reset token is missing in the link URL. Please request a new link.'
      );
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password: data.password,
      }).unwrap();

      toast.success(response.message || 'Password reset successful');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(
        err.data?.message || err.message || 'Failed to reset password'
      );
    }
  };

  // Basic validation indicators
  const hasMinLength = passwordVal.length >= 6;
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(passwordVal);

  return (
    <div className="bg-background relative min-h-screen w-full overflow-x-hidden lg:grid lg:grid-cols-2">
      {/* Theme toggle control */}
      <div className="absolute top-4 right-4 z-30 lg:top-6 lg:right-8">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="lg:text-muted-foreground lg:hover:text-foreground flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:text-white/80"
        >
          {theme === 'dark' ? (
            <>
              <COMMON.SUN className="size-4" />
              <span>Light mode</span>
            </>
          ) : (
            <>
              <COMMON.MOON className="size-4" />
              <span>Dark mode</span>
            </>
          )}
        </button>
      </div>

      {/* Left Sidebar (Desktop only) */}
      <aside className="from-primary relative hidden flex-col justify-between overflow-hidden bg-linear-to-br to-indigo-950 p-10 text-white lg:flex xl:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-size-[16px_16px]" />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-white/5 bg-white/10 text-white">
            <COMMON.GRADUATION_CAP className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg leading-none font-bold tracking-tight">
              CampusCore
            </span>
            <span className="mt-0.5 text-xs text-white/60">
              School Management System
            </span>
          </div>
        </div>

        {/* Highlight content */}
        <div className="my-auto max-w-md space-y-8 py-8">
          <div className="space-y-4">
            <h1 className="text-3xl leading-tight font-bold tracking-tight text-white xl:text-4xl">
              Set New Password
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-white/70 xl:text-base">
              Create a new secure password for your account. Make sure it
              satisfies security guidelines.
            </p>
          </div>

          <ul className="space-y-6">
            {HIGHLIGHTS.map(({ title, subtitle, Icon }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/10 text-white shadow-xs">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm leading-normal font-semibold text-white">
                    {title}
                  </span>
                  <span className="mt-0.5 text-xs text-white/60">
                    {subtitle}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Copyright */}
        <div className="mt-auto">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CampusCore. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Form Area */}
      <main className="bg-background relative flex min-h-screen flex-col lg:justify-center">
        {/* Mobile Header Banner */}
        <div className="from-primary relative flex flex-col gap-4 overflow-hidden rounded-b-[2.5rem] bg-linear-to-br to-indigo-950 p-8 pb-10 text-white shadow-md lg:hidden">
          <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-size-[16px_16px]" />

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-white/5 bg-white/10 text-white">
              <COMMON.GRADUATION_CAP className="size-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-none font-bold tracking-tight">
                CampusCore
              </span>
              <span className="mt-0.5 text-xs text-white/60">
                School Management System
              </span>
            </div>
          </div>
        </div>

        {/* Form panel content */}
        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-95 space-y-6">
            {!token ? (
              <div className="space-y-4 text-center">
                <div className="bg-destructive/10 text-destructive mx-auto flex size-16 items-center justify-center rounded-2xl">
                  <COMMON.X className="size-8 stroke-3" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-foreground text-2xl font-bold tracking-tight">
                    Invalid Reset Link 🔗
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    This password reset link is invalid because the token query
                    parameter is missing. Please check the URL or request a new
                    password reset.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/forgot-password')}
                  className="bg-primary text-primary-foreground hover:bg-primary/95 mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
                >
                  Request another link
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                    Reset your password 🔒
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Enter and confirm your new password below.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-foreground text-sm font-semibold"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <COMMON.LOCK className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        autoFocus
                        className="bg-muted/30 border-border focus-visible:ring-primary h-11 rounded-xl px-10.5"
                        aria-invalid={!!errors.password}
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <COMMON.EYE_OFF className="size-4" />
                        ) : (
                          <COMMON.EYE className="size-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive mt-1 text-xs font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-foreground text-sm font-semibold"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <COMMON.LOCK className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="bg-muted/30 border-border focus-visible:ring-primary h-11 rounded-xl px-10.5"
                        aria-invalid={!!errors.confirmPassword}
                        {...register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1"
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword ? (
                          <COMMON.EYE_OFF className="size-4" />
                        ) : (
                          <COMMON.EYE className="size-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-destructive mt-1 text-xs font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Security requirements list */}
                  <div className="bg-muted/20 border-border space-y-2 rounded-xl border p-3.5">
                    <span className="text-foreground text-xs font-semibold">
                      Password requirements:
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      <li className="flex items-center gap-2">
                        <span
                          className={`flex size-4 shrink-0 items-center justify-center rounded-full ${hasMinLength ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}
                        >
                          <COMMON.CHECK className="size-2.5 stroke-3" />
                        </span>
                        <span
                          className={
                            hasMinLength
                              ? 'font-medium text-emerald-500'
                              : 'text-muted-foreground'
                          }
                        >
                          At least 6 characters
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={`flex size-4 shrink-0 items-center justify-center rounded-full ${hasNumberOrSpecial ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}
                        >
                          <COMMON.CHECK className="size-2.5 stroke-3" />
                        </span>
                        <span
                          className={
                            hasNumberOrSpecial
                              ? 'font-medium text-emerald-500'
                              : 'text-muted-foreground'
                          }
                        >
                          Contains a number or special character
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/95 mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <COMMON.LOADER className="size-4 animate-spin" />
                    ) : (
                      <COMMON.LOCK className="size-4" />
                    )}
                    {isLoading ? 'Resetting password…' : 'Reset password'}
                  </Button>
                </form>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-center gap-2 text-center text-xs font-medium transition-colors"
                  >
                    Back to sign in page
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
