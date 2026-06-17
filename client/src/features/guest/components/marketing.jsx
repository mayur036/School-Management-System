import { GUEST } from '@/lib/icons';
import { cn } from '@/lib/utils';

/** Small uppercase label that sits above a section heading. */
export const Eyebrow = ({ children, className }) => (
  <span
    className={cn(
      'bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase',
      className
    )}
  >
    <GUEST.SPARKLES className="size-3.5" />
    {children}
  </span>
);

/** Centered section header: eyebrow + title + optional description. */
export const SectionHeading = ({ eyebrow, title, description, className }) => (
  <div className={cn('mx-auto max-w-2xl text-center', className)}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="text-foreground mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
      {title}
    </h2>
    {description && (
      <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-base leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

/** Bordered feature card with an icon, title and description. */
export const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-card border-border/60 hover:border-primary/40 group rounded-xl border p-6 transition-colors hover:shadow-xs">
    <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
      <Icon className="size-5" />
    </div>
    <h3 className="text-foreground mt-4 text-base font-bold">{title}</h3>
    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{desc}</p>
  </div>
);
