import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { GUEST } from '@/lib/icons';

import { Eyebrow, SectionHeading } from '../components/marketing';

const VALUES = [
  {
    icon: GUEST.SECURITY,
    title: 'Security first',
    desc: 'Tenant isolation, role-based access and validated inputs are built into every layer — not bolted on later.',
  },
  {
    icon: GUEST.DASHBOARD,
    title: 'Clarity over clutter',
    desc: 'A quiet, data-first interface that surfaces exactly what each role needs and hides the rest.',
  },
  {
    icon: GUEST.USERS,
    title: 'Built for people',
    desc: 'From super admins to department staff, every workflow is designed around how schools actually operate.',
  },
  {
    icon: GUEST.CHECK,
    title: 'Reliable by design',
    desc: 'Predictable behavior, consistent feedback and an auditable trail across scheduling, attendance and leave.',
  },
];

const HIGHLIGHTS = [
  'Single platform for super admins, school admins and staff',
  'Department-organized staff directory with status control',
  'Period-based scheduling with bulk timetable creation',
  'Clock in/out attendance with real-time status',
  'Leave requests with full review and approval history',
  'Task assignment with progress tracking',
];

export const About = () => {
  return (
    <>
      {/* Intro */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Eyebrow>About CampusCore</Eyebrow>
        <h1 className="text-foreground mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Software that understands how schools really work
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
          CampusCore brings every part of school administration into one secure,
          multi-tenant platform — so institutions spend less time wrestling with
          tools and more time running their schools.
        </p>
      </section>

      {/* Mission split */}
      <section className="bg-muted/30 border-border/60 border-y">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Eyebrow>Our mission</Eyebrow>
            <h2 className="text-foreground mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              One coherent system, every role accounted for
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Most schools juggle spreadsheets, disconnected tools and manual
              processes. CampusCore replaces that with a single role-aware
              platform where super admins manage institutions, school admins run
              day-to-day operations, and staff handle their own schedules,
              attendance and tasks.
            </p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Every tenant's data stays strictly isolated, and every action is
              guarded by clear permissions — security and simplicity working
              together.
            </p>
          </div>

          <ul className="grid gap-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="bg-card border-border/60 flex items-start gap-3 rounded-lg border p-4"
              >
                <GUEST.CHECK className="text-primary mt-0.5 size-5 shrink-0" />
                <span className="text-foreground text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we value"
          title="Principles behind every screen"
          description="The same standards guide every feature we ship."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
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
      </section>

      {/* CTA */}
      <section className="border-border/60 border-t">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Want to see it in action?
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-base leading-relaxed">
            Sign in to your dashboard or get in touch — we're happy to walk you
            through how CampusCore fits your institution.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">View Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
