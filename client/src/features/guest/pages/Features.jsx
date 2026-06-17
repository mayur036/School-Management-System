import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST } from '@/lib/icons';

import { Eyebrow, SectionHeading } from '../components/marketing';

const MODULES = [
  {
    icon: GUEST.BUILDING,
    title: 'Institution Management',
    desc: 'Super admins create and configure schools, provision primary administrators, and toggle institution status across the platform.',
    points: [
      'Create and update school profiles',
      'Provision school administrators',
      'Activate or deactivate institutions',
    ],
  },
  {
    icon: GUEST.USERS,
    title: 'Departments & Staff',
    desc: 'Organize staff into departments, register academic or support employees, and manage their access from one directory.',
    points: [
      'Custom departments per school',
      'Academic and support staff records',
      'Active/inactive status control',
    ],
  },
  {
    icon: GUEST.SCHEDULE,
    title: 'Schedules & Periods',
    desc: 'Define the period structure and working days, then build school-wide weekly timetables individually or in bulk.',
    points: [
      'Configurable periods and breaks',
      'Working-days settings',
      'Single and bulk schedule creation',
    ],
  },
  {
    icon: GUEST.ATTENDANCE,
    title: 'Attendance & Clocking',
    desc: 'Staff clock in and out with live status while admins get a clean, auditable daily attendance picture.',
    points: [
      'Real-time clock in / out',
      'Present, late, absent and leave states',
      'Daily attendance overview',
    ],
  },
  {
    icon: GUEST.USER_CHECK,
    title: 'Leave Management',
    desc: 'A simple request-and-review flow that keeps a full history of every leave decision.',
    points: [
      'Quick leave requests for staff',
      'Approve or reject with one click',
      'Complete decision history',
    ],
  },
  {
    icon: GUEST.TASKS,
    title: 'Tasks & Duties',
    desc: 'Assign duties to staff and follow them through pending, in-progress and completed states.',
    points: [
      'Assign tasks to any staff member',
      'Track status transitions',
      'Keep everyone aligned',
    ],
  },
];

export const Features = () => {
  return (
    <>
      {/* Intro */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Eyebrow>Features</Eyebrow>
        <h1 className="text-foreground mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Every tool your school needs, in one place
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
          CampusCore covers the full administrative lifecycle — from onboarding
          an institution to a staff member updating a task — with role-aware
          access at every step.
        </p>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {MODULES.map(({ icon: Icon, title, desc, points }) => (
            <div
              key={title}
              className="bg-card border-border/60 hover:border-primary/40 rounded-xl border p-6 transition-colors sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h2 className="text-foreground text-lg font-bold">{title}</h2>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid gap-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5">
                    <GUEST.CHECK className="text-primary size-4 shrink-0" />
                    <span className="text-foreground text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Security strip */}
      <section className="bg-muted/30 border-border/60 border-y">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Secure by default"
            title="Protection built into every layer"
            description="Security isn't a feature you switch on — it's how the whole platform is built."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: GUEST.SECURITY,
                title: 'Tenant isolation',
                desc: 'Each school only ever sees its own data — enforced at the data layer and re-checked on every request.',
              },
              {
                icon: GUEST.LOCK,
                title: 'Role-based access',
                desc: 'Permissions are scoped to super admin, school admin and staff, so nobody sees more than they should.',
              },
              {
                icon: GUEST.CHECK,
                title: 'Validated input',
                desc: 'Every form and endpoint is strictly validated, keeping records clean and consistent.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border-border/60 rounded-xl border p-6"
              >
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-foreground mt-4 text-base font-bold">
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
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          See how it fits your school
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-base leading-relaxed">
          Sign in to explore the dashboard, or reach out with your questions.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Features;
