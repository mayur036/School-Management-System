import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from '@/features/auth/auth.api';
import { BASE } from '@/lib/icons';
import { roleHome } from '@/lib/roles';
import { loginSchema } from '@/schemas/auth.schema';

const HIGHLIGHTS = [
  {
    Icon: BASE.BUILDING,
    title: 'Multi-tenant administration',
    subtitle: 'for every school',
  },
  {
    Icon: BASE.USERS,
    title: 'Department-organized',
    subtitle: 'staff directory',
  },
  {
    Icon: BASE.SHIELD_CHECK,
    title: 'Role-based access',
    subtitle: 'for admins and staff',
  },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      toast.success(response.message || 'Login successful');
      navigate(roleHome(response.data?.user?.role_name), { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleGoogleSuccess = async (credential) => {
    try {
      const response = await googleLogin(credential).unwrap();
      toast.success(response.message || 'Login successful');
      navigate(roleHome(response.data?.user?.role_name), { replace: true });
    } catch (err) {
      toast.error(err.message || 'Google login failed');
    }
  };

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
              <BASE.SUN className="size-4" />
              <span>Light mode</span>
            </>
          ) : (
            <>
              <BASE.MOON className="size-4" />
              <span>Dark mode</span>
            </>
          )}
        </button>
      </div>

      {/* Left Sidebar (Desktop only) */}
      <aside className="from-primary relative hidden flex-col justify-between overflow-hidden bg-linear-to-br to-indigo-950 p-10 text-white lg:flex xl:p-12">
        {/* Dot pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-linear(#ffffff15_1px,transparent_1px)] bg-size-[16px_16px]" />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-white/5 bg-white/10 text-white">
            <BASE.GRADUATION_CAP className="size-6" />
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
              Manage your school,
              <br />
              all in one place.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-white/70 xl:text-base">
              Onboard schools, organize departments, and manage staff from a
              single, secure administration platform.
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
          {/* Dot pattern */}
          <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-[radial-linear(#ffffff15_1px,transparent_1px)] bg-size-[16px_16px]" />

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-white/5 bg-white/10 text-white">
              <BASE.GRADUATION_CAP className="size-6" />
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
            <div className="space-y-2">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back 👋
              </h2>
              <p className="text-muted-foreground text-sm">
                Sign in to your account to continue
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-foreground text-sm font-semibold"
                >
                  Email address
                </Label>
                <div className="relative">
                  <BASE.MAIL className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    autoFocus
                    className="bg-muted/30 border-border focus-visible:ring-primary h-11 rounded-xl pl-10.5"
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive mt-1 text-xs font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-foreground text-sm font-semibold"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-primary cursor-pointer text-xs font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <BASE.LOCK className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                      <BASE.EYE_OFF className="size-4" />
                    ) : (
                      <BASE.EYE className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive mt-1 text-xs font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  className="border-muted-foreground/30 text-primary focus:ring-primary rounded"
                />
                <Label
                  htmlFor="remember"
                  className="text-muted-foreground cursor-pointer text-xs leading-none font-medium select-none"
                >
                  Keep me signed in on this device
                </Label>
              </div>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/95 mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <BASE.LOADER className="size-4 animate-spin" />
                ) : (
                  <BASE.LOCK className="size-4" />
                )}
                {isLoading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border w-full border-t"></div>
              </div>
              <span className="bg-background text-muted-foreground relative px-3 text-xs font-medium uppercase">
                or
              </span>
            </div>

            <div className="flex w-full justify-center">
              <GoogleLogin
                onSuccess={(cred) => handleGoogleSuccess(cred.credential)}
                onError={() => toast.error('Google sign-in failed')}
                text="continue_with"
                width="320"
              />
            </div>

            <div className="pt-2">
              <p className="text-muted-foreground text-center text-xs">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-primary cursor-pointer font-semibold hover:underline"
                >
                  Contact your administrator
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
