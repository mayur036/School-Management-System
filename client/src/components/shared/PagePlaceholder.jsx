/**
 * Minimal placeholder shown while a feature page is not yet implemented.
 * Renders just the page name (and optional icon/description) — no mock data.
 */
const PagePlaceholder = ({ title, description, Icon }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    {Icon && (
      <div
        aria-hidden
        className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl"
      >
        <Icon className="size-6" />
      </div>
    )}
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  </div>
);

export default PagePlaceholder;
