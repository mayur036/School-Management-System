import { useState } from 'react';
import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import COMMON from '@/lib/icons/common.icons';
import { roleHome } from '@/lib/roles';

/**
 * Per-status copy + iconography. `accent` drives the icon chip / status dot
 * colour so each error reads at a glance.
 */
const ERROR_MAP = {
  400: {
    title: 'Bad Request',
    message:
      'The request could not be understood. Please check the link and try again.',
    Icon: COMMON.SHIELD_ALERT,
    accent: 'amber',
  },
  401: {
    title: 'Authentication Required',
    message:
      'You need to be signed in to access this resource. Please sign in and try again.',
    Icon: COMMON.LOCK,
    accent: 'amber',
  },
  403: {
    title: 'Access Denied',
    message:
      "You don't have permission to view this page. Contact your administrator if you believe this is a mistake.",
    Icon: COMMON.SHIELD_ALERT,
    accent: 'amber',
  },
  404: {
    title: 'Page Not Found',
    message:
      "We couldn't find the page you're looking for. It may have been moved, renamed, or never existed.",
    Icon: COMMON.FILE_QUESTION,
    accent: 'primary',
  },
  500: {
    title: 'Something Went Wrong',
    message:
      'An unexpected error occurred on our end. Our team has been notified — please try again shortly.',
    Icon: COMMON.SERVER_CRASH,
    accent: 'destructive',
  },
  503: {
    title: 'Service Unavailable',
    message:
      'The service is temporarily down for maintenance. Please check back in a few minutes.',
    Icon: COMMON.WRENCH,
    accent: 'destructive',
  },
};

// Tailwind class sets per accent (kept static so JIT can see them).
const ACCENT = {
  primary: {
    chip: 'bg-primary/10 text-primary',
    ring: 'border-primary/30',
    dot: 'bg-primary',
  },
  amber: {
    chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    ring: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  destructive: {
    chip: 'bg-destructive/10 text-destructive',
    ring: 'border-destructive/30',
    dot: 'bg-destructive',
  },
};

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Resolve the status: route errors keep their code, thrown errors are 500,
  // and the bare catch-all (`*`) mount is a 404.
  let statusCode;
  let technicalDetail = '';
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    technicalDetail =
      error.data?.message || error.data || error.statusText || '';
  } else if (error) {
    statusCode = 500;
    technicalDetail = error.message || String(error);
  } else {
    statusCode = 404;
  }

  const { title, message, Icon, accent } = ERROR_MAP[statusCode] ?? {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again.',
    Icon: COMMON.SERVER_CRASH,
    accent: 'destructive',
  };
  const tone = ACCENT[accent];
  const isServerError = statusCode >= 500;

  // Stable per-visit reference id for support / log correlation.
  const [referenceId] = useState(
    () =>
      `ERR-${statusCode}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );

  const homeTarget = isAuthenticated ? roleHome(user?.role_name) : '/';
  const homeLabel = isAuthenticated ? 'Back to dashboard' : 'Back to home';

  return (
    <main
      role="main"
      className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
    >
      {/* ── Decorative background (non-interactive) ──────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="bg-primary/10 absolute top-[-15%] left-[-10%] size-[45vw] rounded-full blur-[120px] motion-safe:animate-pulse" />
        <div
          className="bg-destructive/10 absolute right-[-10%] bottom-[-15%] size-[45vw] rounded-full blur-[130px] motion-safe:animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_55%_50%_at_50%_45%,#000_60%,transparent_100%)] bg-size-[32px_32px] opacity-40" />
      </div>

      {/* ── Error card ───────────────────────────────────────────── */}
      <section className="border-border bg-card/80 relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border px-6 py-10 shadow-2xl backdrop-blur-xl sm:p-12">
        {/* Watermark status code */}
        <span
          aria-hidden
          className="text-foreground/[0.035] pointer-events-none absolute inset-x-0 top-0 text-center text-[7rem] leading-none font-black tracking-tighter tabular-nums select-none sm:top-2 sm:text-[12rem] lg:text-[16rem]"
        >
          {statusCode}
        </span>

        <div className="relative flex flex-col items-center text-center">
          {/* Icon chip with concentric ring */}
          <div className="relative mb-6 grid size-24 place-items-center sm:size-28">
            <div
              className={`absolute inset-0 rounded-full border-y-2 border-x-transparent ${tone.ring} motion-safe:animate-[spin_12s_linear_infinite]`}
            />
            <div
              className={`absolute inset-3 rounded-full border-x-2 border-y-transparent ${tone.ring} motion-safe:animate-[spin_18s_linear_infinite_reverse]`}
            />
            <div
              className={`bg-card border-border grid size-16 place-items-center rounded-2xl border shadow-lg sm:size-20 ${tone.chip}`}
            >
              <Icon className="size-8 sm:size-9" strokeWidth={1.75} />
            </div>
          </div>

          {/* Status pill */}
          <span className="border-border bg-muted/50 text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <span className={`size-1.5 rounded-full ${tone.dot}`} />
            Error {statusCode}
          </span>

          <h1 className="text-foreground text-2xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>

          <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed text-pretty sm:text-base">
            {message}
          </p>

          {/* Actions */}
          <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="h-12 flex-1 cursor-pointer gap-2 rounded-xl px-6 text-base font-semibold sm:max-w-48 sm:text-sm"
            >
              <Link to={homeTarget}>
                <COMMON.HOME className="size-4.5 sm:size-4" />
                {homeLabel}
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="group h-12 flex-1 cursor-pointer gap-2 rounded-xl px-6 text-base font-semibold sm:max-w-48 sm:text-sm"
            >
              <COMMON.ARROW_LEFT className="size-4.5 transition-transform group-hover:-translate-x-0.5 sm:size-4" />
              Go back
            </Button>
          </div>

          {/* Retry for server-side errors */}
          {isServerError && (
            <Button
              variant="ghost"
              onClick={() => navigate(0)}
              className="text-muted-foreground hover:text-foreground mt-3 h-9 cursor-pointer gap-2 text-xs font-medium"
            >
              <COMMON.ROTATE_CCW className="size-3.5" />
              Try again
            </Button>
          )}

          {/* Technical details (only when a real error message exists) */}
          {technicalDetail && (
            <details className="group border-border/70 mt-8 w-full rounded-xl border text-left">
              <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs font-semibold">
                Technical details
                <COMMON.CHEVRON_DOWN className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-border/70 space-y-2 border-t px-4 py-3">
                <p className="text-muted-foreground font-mono text-xs wrap-break-word">
                  {technicalDetail}
                </p>
                <p className="text-muted-foreground/80 flex items-center gap-1.5 text-[10px]">
                  Reference:
                  <span className="bg-muted text-foreground/80 rounded px-1.5 py-0.5 font-mono">
                    {referenceId}
                  </span>
                </p>
              </div>
            </details>
          )}
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
