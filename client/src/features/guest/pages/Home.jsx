import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST } from '@/lib/icons';

import { Eyebrow, FeatureCard, SectionHeading } from '../components/marketing';

const FEATURES = [
  {
    icon: GUEST.SECURITY,
    title: 'Multi-Tenant Isolation',
    desc: 'Strict data scoping per school. Super admins oversee platform health while each school manages its own records in complete isolation.',
  },
  {
    icon: GUEST.SCHEDULE,
    title: 'Schedules & Periods',
    desc: 'Define period structures and working days, then build school-wide weekly timetables — single entries or bulk in one pass.',
  },
  {
    icon: GUEST.ATTENDANCE,
    title: 'Attendance & Clocking',
    desc: 'Staff clock in and out with real-time status, while admins get a clear, auditable view of daily attendance.',
  },
  {
    icon: GUEST.TASKS,
    title: 'Tasks & Duties',
    desc: 'Assign duties to staff, track progress through pending, in-progress and completed states, and keep everyone aligned.',
  },
  {
    icon: GUEST.USER_CHECK,
    title: 'Leave Management',
    desc: 'Staff request leave in seconds; admins review, approve or reject with a full history of every decision.',
  },
  {
    icon: GUEST.USERS,
    title: 'Staff Directory',
    desc: 'Register academic and support staff under custom departments, toggle active status, and manage secure access.',
  },
];

const STATS = [
  { value: '3', label: 'Distinct roles' },
  { value: '100%', label: 'Tenant-isolated' },
  { value: '24/7', label: 'Secure access' },
  { value: '9', label: 'Core modules' },
];

const ROLES = [
  {
    icon: GUEST.BUILDING,
    title: 'Super Admin',
    desc: 'Spins up new schools and provisions their primary administrators across the platform.',
  },
  {
    icon: GUEST.DASHBOARD,
    title: 'School Admin',
    desc: 'Manages departments, staff, schedules, tasks and leave reviews for their own school.',
  },
  {
    icon: GUEST.USER_CHECK,
    title: 'Staff',
    desc: 'Clocks in, views weekly schedules, requests leave and updates assigned tasks.',
  },
];

export const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-b to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <Eyebrow>Platform Overview</Eyebrow>
          <h1 className="text-foreground mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Run your entire school from one secure place
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
            CampusCore is a multi-tenant management platform for Super Admins,
            School Administrators and Department Staff — covering scheduling,
            attendance, tasks and leave in a single, role-aware system.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/login">
                Sign In to Dashboard
                <GUEST.ARROW_RIGHT className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-border/60 border-y">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-2 py-8 text-center">
              <div className="text-foreground text-3xl font-bold tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Everything included"
          title="One platform, every workflow"
          description="From the first school onboarding to a staff member clocking out, every operation is handled in a single, coherent system."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-muted/30 border-border/60 border-y">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Built for every role"
            title="The right view for everyone"
            description="Access and capabilities adapt to who is signed in — no clutter, no guesswork."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ROLES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border-border/60 rounded-xl border p-6 text-center"
              >
                <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-xl">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-foreground mt-4 text-lg font-bold">
                  {title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="from-primary relative overflow-hidden rounded-2xl bg-linear-to-br to-indigo-700 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to manage your school the simple way?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Sign in to your dashboard, or reach out and we'll help you get
              your institution set up.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
