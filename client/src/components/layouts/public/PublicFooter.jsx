import { Link, NavLink } from 'react-router-dom';

import { GUEST } from '@/lib/icons';

import { PUBLIC_NAV_LINKS } from './nav.config';

/** Brand glyphs (Simple Icons paths) — lucide no longer ships brand logos. */
const BrandIcon = ({ path, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d={path} />
  </svg>
);

const SOCIAL = [
  {
    label: 'X',
    href: 'https://x.com',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
];

export const PublicFooter = () => (
  <footer className="border-border/60 bg-muted/30 border-t">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl">
              <GUEST.LOGO className="size-5" />
            </span>
            <span className="text-foreground text-base font-bold tracking-tight">
              CampusCore
            </span>
          </Link>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            A secure, multi-tenant platform that brings schools, administrators,
            and staff together in one place.
          </p>
        </div>

        {/* Nav + contact */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-foreground text-sm font-semibold">Navigate</h3>
            <ul className="mt-4 space-y-3">
              {PUBLIC_NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground text-sm font-semibold">Account</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/forgot-password"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-foreground text-sm font-semibold">Contact</h3>
            <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <GUEST.MAIL className="size-4 shrink-0" />
                <a
                  href="mailto:hello@campuscore.com"
                  className="hover:text-foreground transition-colors"
                >
                  hello@campuscore.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <GUEST.PHONE className="size-4 shrink-0" />
                <span>+1 (555) 010-2025</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-border/60 mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} CampusCore. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {SOCIAL.map(({ path, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors"
            >
              <BrandIcon path={path} className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
