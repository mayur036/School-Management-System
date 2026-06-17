import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import PublicFooter from './PublicFooter';
import PublicNavbar from './PublicNavbar';

/**
 * Shell for all public/marketing pages (Home, Features, About, Contact).
 * Renders a shared navbar + footer and scrolls to top on route change.
 * Auth pages (login, reset password) intentionally live outside this layout.
 */
export const PublicLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
