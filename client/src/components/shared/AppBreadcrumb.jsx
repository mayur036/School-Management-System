import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { BASE } from '@/lib/icons';

// Helper to determine which icon to show based on category labels
const getBreadcrumbIcon = (label = '') => {
  const l = label.toLowerCase();
  if (l.includes('student')) return BASE.GRADUATION_CAP;
  if (l.includes('class')) return BASE.GRID_VIEW;
  if (l.includes('department')) return BASE.GRID_VIEW;
  if (
    l.includes('staff') ||
    l.includes('admin') ||
    l.includes('employee') ||
    l.includes('member') ||
    l.includes('teacher')
  )
    return BASE.USERS;
  if (l.includes('setting') || l.includes('config')) return BASE.SETTINGS;
  if (l.includes('profile')) return BASE.USER;
  if (l.includes('attendance') || l.includes('time') || l.includes('clock'))
    return BASE.CLOCK;
  if (l.includes('leave') || l.includes('request') || l.includes('absence'))
    return BASE.CALENDAR;
  if (l.includes('timetable') || l.includes('schedule')) return BASE.CALENDAR;
  if (l.includes('subject')) return BASE.FILE_TEXT;
  return BASE.GRADUATION_CAP; // default fallback
};

/**
 * Re-designed Breadcrumb component matching eSkooly card layout.
 */
const AppBreadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  // Generic labels to avoid placing the primary category icon next to
  const genericLabels = [
    'home',
    'dashboard',
    'super admin',
    'school admin',
    'staff',
    'admin',
  ];

  // Find index of first item representing a concrete feature category
  let iconIndex = items.findIndex(
    (item) => !genericLabels.includes(item.label.toLowerCase())
  );
  if (iconIndex === -1) {
    iconIndex = 0;
  }

  const targetLabel = items[iconIndex]?.label || '';
  const Icon = getBreadcrumbIcon(targetLabel);

  return (
    <div className="bg-card border-border flex w-full items-center justify-between rounded-[14px] border px-5 py-3.5 shadow-sm select-none dark:shadow-none">
      {/* Left: Navigation Path with Inline Category Icon */}
      <div className="flex items-center text-xs font-medium sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isMainCategory = index === iconIndex;

          return (
            <div key={index} className="flex items-center">
              {isLast ? (
                <span
                  className={
                    isMainCategory
                      ? 'text-foreground flex items-center font-bold'
                      : 'text-muted-foreground font-normal'
                  }
                >
                  {isMainCategory && (
                    <Icon className="text-primary mr-1.5 size-4.5 shrink-0" />
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className={
                    isMainCategory
                      ? 'text-foreground flex items-center font-bold hover:underline'
                      : 'text-muted-foreground hover:text-foreground font-normal transition-colors hover:underline'
                  }
                >
                  {isMainCategory && (
                    <Icon className="text-primary mr-1.5 size-4.5 shrink-0" />
                  )}
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <BASE.CHEVRON_RIGHT className="text-muted-foreground/45 mx-2.5 size-3.5 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Functional Reload Trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.location.reload()}
        className="bg-primary-light hover:bg-primary/15 active:bg-primary/25 text-primary border-primary/20 h-8 shrink-0 cursor-pointer gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors"
      >
        <BASE.REFRESH className="size-3.5" />
        Reload
      </Button>
    </div>
  );
};

export default AppBreadcrumb;
