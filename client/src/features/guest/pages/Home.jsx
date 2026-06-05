import { Building2, ShieldCheck, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const Home = () => {
  return (
    <div className="dark:via-background flex min-h-screen flex-col bg-linear-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Top Navbar */}
      <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary h-5 w-5" />
            <span className="text-foreground text-base font-bold tracking-tight">
              CampusCore
            </span>
          </div>
          <Button size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="flex flex-1 items-center">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <BadgeSecondary text="Platform Overview" />
          <h1 className="text-foreground mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Unified School Management System
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
            A secure, multi-tenant portal for Super Admins, School
            Administrators, and Department Staff to manage academic operations.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/login">Sign In to Dashboard</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
            <CardFeature
              icon={ShieldCheck}
              title="Multi-Tenant Isolation"
              desc="Ensures strict data scoping per school tenant. Super admins oversee platform health while school admins manage their own records."
            />
            <CardFeature
              icon={Building2}
              title="Institution Control"
              desc="Super administrators can spin up new school templates and configure primary administrators with full role isolation."
            />
            <CardFeature
              icon={UserCheck}
              title="Employee Directory"
              desc="Register academic or support staff under custom departments, toggle active status, and maintain secure system authorizations."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border/40 text-muted-foreground border-t py-6 text-center text-xs">
        &copy; {new Date().getFullYear()} CampusCore. All rights reserved.
      </footer>
    </div>
  );
};

const BadgeSecondary = ({ text }) => (
  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase">
    {text}
  </span>
);

const CardFeature = ({ icon: Icon, title, desc }) => (
  <div className="bg-card border-border/60 hover:bg-muted/5 rounded-xl border p-5 shadow-xs transition-colors">
    <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-foreground mt-4 text-base leading-tight font-bold">
      {title}
    </h3>
    <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{desc}</p>
  </div>
);

export default Home;
