import { Button } from '@/components/ui/button';
import { ACTIONS, EMPTY_STATE } from '@/lib/icons';

const getSubjectColorClass = (subjectName) => {
  if (!subjectName)
    return 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900/35';
  const hash = subjectName
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colors = [
    'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/35 dark:border-blue-900/40 dark:text-blue-300',
    'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/35 dark:border-purple-900/40 dark:text-purple-300',
    'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/35 dark:border-emerald-900/40 dark:text-emerald-300',
    'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/35 dark:border-rose-900/40 dark:text-rose-300',
    'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/35 dark:border-indigo-900/40 dark:text-indigo-300',
    'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/35 dark:border-teal-900/40 dark:text-teal-300',
    'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/35 dark:border-amber-900/40 dark:text-amber-300',
  ];
  return colors[hash % colors.length];
};

export const ScheduleGrid = ({
  periods = [],
  workingDays = [],
  schedules = [],
  staffId = '',
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) => {
  // Filter schedules to only display the ones belonging to the selected staff member
  const filteredSchedules = schedules.filter(
    (s) => s.staff_id === Number(staffId)
  );

  // Helper to find schedule entry for a given day and period
  const findSchedule = (day, periodId) => {
    return filteredSchedules.find(
      (s) => s.day_of_week === day && s.period_id === periodId
    );
  };

  if (!staffId) {
    return (
      <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center">
        <EMPTY_STATE.NO_DATA className="mb-3.5 h-12 w-12 text-slate-300" />
        <h3 className="text-foreground text-sm font-semibold">
          Select a Staff Member
        </h3>
        <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
          Choose a teacher from the dropdown above to view and manage their
          weekly schedule grid.
        </p>
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center">
        <EMPTY_STATE.NO_DATA className="mb-3.5 h-12 w-12 text-slate-300" />
        <h3 className="text-foreground text-sm font-semibold">
          No Periods Configured
        </h3>
        <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
          Go to Settings tab to configure periods (bell schedule) before
          managing timetables.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header Row: Days of Week */}
          <thead>
            <tr className="bg-muted/50 border-border border-b">
              <th className="text-muted-foreground border-border w-36 border-r p-3 text-left text-xs font-bold tracking-wider uppercase">
                Period
              </th>
              {workingDays.map((day) => (
                <th
                  key={day}
                  className="text-muted-foreground border-border border-r p-3 text-center text-xs font-bold tracking-wider uppercase last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Grid Rows: Periods */}
          <tbody>
            {periods.map((period) => {
              const { period_id, period_name, start_time, end_time, is_break } =
                period;
              const formattedTime = `${start_time.substring(0, 5)} - ${end_time.substring(0, 5)}`;

              return (
                <tr
                  key={period_id}
                  className={`border-border border-b last:border-b-0 ${
                    is_break
                      ? 'bg-muted/20 dark:bg-muted/5'
                      : 'hover:bg-muted/5'
                  }`}
                >
                  {/* Period Label */}
                  <td className="border-border text-foreground border-r p-3 align-middle text-xs font-medium">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{period_name}</span>
                      <span className="text-muted-foreground font-mono text-[10px] leading-none">
                        {formattedTime}
                      </span>
                    </div>
                  </td>

                  {/* Day Cells */}
                  {workingDays.map((day) => {
                    const entry = findSchedule(day, period_id);

                    if (is_break) {
                      return (
                        <td
                          key={`${period_id}-${day}`}
                          className="border-border border-r p-2 text-center align-middle last:border-r-0"
                        >
                          <span className="text-muted-foreground/60 text-[10px] font-bold tracking-wider uppercase">
                            Break
                          </span>
                        </td>
                      );
                    }

                    if (entry) {
                      return (
                        <td
                          key={`${period_id}-${day}`}
                          className="border-border w-48 min-w-40 border-r p-2 align-middle last:border-r-0"
                        >
                          <div
                            onClick={() => onEditSlot(entry)}
                            className={`group relative cursor-pointer rounded-lg border p-2.5 shadow-2xs transition-all duration-300 ${getSubjectColorClass(
                              entry.subject_name
                            )}`}
                          >
                            <div className="flex flex-col leading-tight">
                              <span className="truncate text-xs font-bold">
                                {entry.subject_name}
                              </span>
                              <span className="mt-1 truncate text-[10px] leading-none font-medium opacity-85">
                                {entry.class_name}
                              </span>
                              {entry.room && (
                                <span className="mt-1 font-mono text-[9px] leading-none opacity-70">
                                  Room {entry.room}
                                </span>
                              )}
                            </div>

                            {/* Actions Overlay on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/5 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 dark:bg-black/25">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-7 w-7 rounded bg-white/95 p-0 shadow hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-900"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditSlot(entry);
                                }}
                              >
                                <ACTIONS.EDIT className="text-foreground h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 w-7 rounded p-0 shadow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSlot(entry.schedule_id);
                                }}
                              >
                                <ACTIONS.DELETE className="h-3.5 w-3.5 text-white" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Empty slot cell with Add Button / Clickable cell
                    return (
                      <td
                        key={`${period_id}-${day}`}
                        onClick={() => onAddSlot(day, period_id)}
                        className="border-border group hover:bg-muted/30 h-18 w-48 min-w-40 cursor-pointer border-r p-2 text-center align-middle transition-all duration-200 last:border-r-0"
                      >
                        <Button
                          variant="ghost"
                          className="border-border/60 hover:bg-primary/5 hover:border-primary/40 hover:text-primary h-10 w-full rounded-lg border border-dashed text-xs font-semibold opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddSlot(day, period_id);
                          }}
                        >
                          <ACTIONS.CREATE className="mr-1 h-3.5 w-3.5" /> Assign
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
