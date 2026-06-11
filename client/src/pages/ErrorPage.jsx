import { useState } from 'react';
import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ACTIONS, BASE, EMPTY_STATE, STATUS } from '@/lib/icons';
import { roleHome } from '@/lib/roles';

/**
 * Swiss Minimalist Design (Project Theme)
 * Uses standard Tailwind/shadcn variables (bg-background, text-primary, etc.)
 */
const ERROR_MAP = {
  400: {
    title: 'Bad Request',
    message:
      'The request could not be understood by the server. Please check the link and try again.',
    Icon: BASE.SHIELD_ALERT,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    troubleshooting: [
      'Check the URL for typos',
      'Clear your browser cache and cookies',
      'Ensure your submitted data is correct',
    ],
  },
  401: {
    title: 'Authentication Required',
    message:
      'You need to be signed in to access this resource. Please sign in and try again.',
    Icon: BASE.LOCK,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    troubleshooting: [
      'Log in to your account',
      'Check if your session has expired',
      'Clear your browser cookies and try again',
    ],
  },
  403: {
    title: 'Access Denied',
    message:
      "You don't have permission to view this page. Contact your administrator if you believe this is a mistake.",
    Icon: BASE.SHIELD_ALERT,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    troubleshooting: [
      'Verify you are logged into the correct account',
      'Request access from your organization admin',
    ],
  },
  404: {
    title: 'Page Not Found',
    message:
      "We couldn't find the page you're looking for. It may have been moved, renamed, or never existed.",
    Icon: EMPTY_STATE.NO_DATA,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    troubleshooting: [
      'Check the URL for typing errors',
      'Navigate back to your dashboard',
      'Check if the resource was deleted',
    ],
  },
  500: {
    title: 'Something Went Wrong',
    message:
      'An unexpected error occurred on our end. Our team has been notified — please try again shortly.',
    Icon: EMPTY_STATE.SERVER_ERROR,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10',
    troubleshooting: [
      'Wait a few minutes and refresh the page',
      'Check our system status page',
      'Contact support if the issue persists',
    ],
  },
  503: {
    title: 'Service Unavailable',
    message:
      'The service is temporarily down for maintenance. Please check back in a few minutes.',
    Icon: BASE.WRENCH,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10',
    troubleshooting: [
      'Wait for the maintenance window to finish',
      'Check our system status page for updates',
    ],
  },
};

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  let statusCode;
  let technicalDetail;

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

  const { title, message, Icon, iconColor, iconBg, troubleshooting } =
    ERROR_MAP[statusCode] ?? {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again.',
      Icon: EMPTY_STATE.SERVER_ERROR,
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      troubleshooting: [
        'Wait a few minutes and try again',
        'Contact technical support',
      ],
    };

  const isServerError = statusCode >= 500;
  const [referenceId] = useState(
    () =>
      `ERR-${statusCode}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );

  const homeTarget = isAuthenticated ? roleHome(user?.role_name) : '/';
  const homeLabel = isAuthenticated ? 'Back to dashboard' : 'Back to home';

  return (
    <main
      role="main"
      className="bg-background text-foreground relative flex min-h-screen items-center justify-center p-4 sm:p-8"
    >
      <div className="border-border bg-card flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border shadow-sm md:flex-row">
        {/* Main Error Content */}
        <section className="relative flex flex-1 flex-col justify-center overflow-hidden p-8 sm:p-12">
          {/* Subtle Watermark Background */}
          <div className="text-muted/30 pointer-events-none absolute top-[-5%] right-[-5%] z-0 hidden text-[14rem] leading-none font-black select-none sm:block">
            {statusCode}
          </div>

          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-4">
              <div
                className={`flex size-14 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
              >
                <Icon className="size-7" strokeWidth={2} />
              </div>
              <div>
                <div className="text-muted-foreground text-sm font-medium">
                  Error {statusCode}
                </div>
                <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  {title}
                </h1>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 max-w-md text-base leading-relaxed">
              {message}
            </p>

            {/* Troubleshooting Steps */}
            {troubleshooting && (
              <div className="mb-10 space-y-3">
                <h4 className="text-foreground text-sm font-semibold">
                  What you can do:
                </h4>
                <ul className="space-y-2">
                  {troubleshooting.map((step, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex items-start gap-2 text-sm"
                    >
                      <STATUS.ACTIVE className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button asChild className="cursor-pointer font-medium">
                <Link to={homeTarget}>
                  <BASE.HOME className="mr-2 size-4" />
                  {homeLabel}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="cursor-pointer font-medium"
              >
                <BASE.ARROW_LEFT className="mr-2 size-4" />
                Go back
              </Button>
              {isServerError && (
                <Button
                  variant="ghost"
                  onClick={() => navigate(0)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer font-medium"
                >
                  <ACTIONS.RESTORE className="mr-2 size-4" />
                  Try again
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Support & Technical Details (Side Panel) */}
        <section className="bg-muted/30 border-border relative z-10 flex w-full flex-col justify-between border-t p-8 sm:p-12 md:w-96 md:border-t-0 md:border-l">
          <div>
            <h3 className="text-foreground mb-6 flex items-center gap-2 text-sm font-semibold">
              <BASE.LIFE_BUOY className="text-muted-foreground size-4" />
              Need more help?
            </h3>

            <div className="space-y-4">
              <Link
                to="/support"
                className="border-border bg-background hover:border-primary/50 group flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-md p-2">
                    <BASE.MAIL className="size-4" />
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    Contact Support
                  </span>
                </div>
                <BASE.CHEVRON_RIGHT className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
              </Link>

              <Link
                to="/status"
                className="border-border bg-background hover:border-primary/50 group flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 text-success rounded-md p-2">
                    <STATUS.ACTIVE className="size-4" />
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    System Status
                  </span>
                </div>
                <BASE.CHEVRON_RIGHT className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-12">
            <h3 className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
              <BASE.INFO className="text-muted-foreground size-4" />
              Technical Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-muted-foreground text-xs font-medium">
                  Reference ID
                </div>
                <div className="bg-background border-border text-foreground rounded-md border px-2.5 py-1.5 font-mono text-xs select-all">
                  {referenceId}
                </div>
              </div>

              {technicalDetail && (
                <div className="space-y-1.5">
                  <div className="text-muted-foreground text-xs font-medium">
                    Message
                  </div>
                  <div className="text-muted-foreground max-h-32 overflow-y-auto text-xs wrap-break-word">
                    {technicalDetail}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ErrorPage;
