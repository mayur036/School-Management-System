import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import logo from '@/assets/logo/logo.png';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '@/features/auth/auth.api';
import ThemeToggler from '@/helper/ThemeToggler';
import { roleHome } from '@/lib/roles';
import { cn } from '@/lib/utils';
import { loginSchema } from '@/schemas/auth.schema';

const HIGHLIGHTS = [
  { Icon: Building2, text: 'Multi-tenant administration for every school' },
  { Icon: Users, text: 'Department-organized staff directory' },
  { Icon: ShieldCheck, text: 'Role-based access for admins and staff' },
];

const BrandMark = ({ className = '', light = false }) => (
  <div className={cn('flex items-center', className)}>
    <img
      src={logo}
      alt="eSchool Logo"
      className={cn(
        'h-9 w-auto object-contain transition-all',
        light ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'
      )}
    />
  </div>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
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
    toast.info(
      'Please contact your school administrator to reset your password.',
      {
        duration: 5000,
      }
    );
  };

  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Theme toggle control */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggler />
      </div>

      {/* Brand panel (desktop) */}
      <aside className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-12">
        <BrandMark light />

        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-white xl:text-4xl">
            Manage your school, all in one place.
          </h1>
          <p className="text-primary-foreground text-base leading-relaxed">
            Onboard schools, organize departments, and manage staff from a
            single, secure administration platform.
          </p>
          <ul className="space-y-4 pt-2">
            {HIGHLIGHTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                  <Icon className="size-4" />
                </span>
                <span className="text-primary-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-primary-foreground text-xs">
          © {new Date().getFullYear()} CampusCore. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:min-h-0 lg:px-8">
        <div className="w-full max-w-sm">
          {/* Brand logo for mobile viewports */}
          <BrandMark className="mb-10 lg:hidden" />

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                autoFocus
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-destructive mt-1.5 text-xs font-medium"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-primary cursor-pointer text-xs font-medium transition-colors hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  {...register('password')}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    aria-pressed={showPassword}
                    size="icon-xs"
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-destructive mt-1.5 text-xs font-medium"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-muted-foreground cursor-pointer text-xs leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Keep me signed in on this device
              </label>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer gap-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
