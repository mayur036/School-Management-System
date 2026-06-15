import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  useGetSchoolSettingsQuery,
  useUpdateWorkingDaysMutation,
} from '@/features/school_admin/schedule.api';

const ALL_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const WorkingDaysConfig = () => {
  const { data: settingsData, isLoading } = useGetSchoolSettingsQuery();
  const [updateWorkingDays, { isLoading: isUpdating }] =
    useUpdateWorkingDaysMutation();

  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    if (settingsData?.data?.settings?.working_days) {
      const days = settingsData.data.settings.working_days
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      setSelectedDays(days);
    }
  }, [settingsData]);

  const handleToggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (selectedDays.length === 0) {
      toast.error('You must select at least one working day');
      return;
    }

    // Order the days as they appear in the week
    const orderedSelected = ALL_DAYS.filter((d) => selectedDays.includes(d));
    const workingDaysString = orderedSelected.join(',');

    try {
      const res = await updateWorkingDays({
        working_days: workingDaysString,
      }).unwrap();
      toast.success(res.message || 'Working days updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update working days');
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="border-border border-b pb-3">
        <CardTitle className="text-foreground text-base font-semibold">
          School Working Days
        </CardTitle>
        <CardDescription className="text-xs">
          Select the active days of the week for scheduling classes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isLoading ? (
          <div className="space-y-2 py-4">
            <div className="bg-muted h-5 w-40 animate-pulse rounded" />
            <div className="bg-muted h-5 w-48 animate-pulse rounded" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ALL_DAYS.map((day) => {
                const isChecked = selectedDays.includes(day);
                return (
                  <div
                    key={day}
                    onClick={() => handleToggleDay(day)}
                    className={`hover:bg-muted/40 flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 transition-all duration-200 select-none ${
                      isChecked
                        ? 'border-primary/30 bg-primary/5 dark:bg-primary/5'
                        : 'border-border bg-transparent'
                    }`}
                  >
                    <Checkbox
                      id={`day-${day}`}
                      checked={isChecked}
                      onCheckedChange={() => handleToggleDay(day)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Label
                      htmlFor={`day-${day}`}
                      className="text-foreground cursor-pointer text-xs font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {day}
                    </Label>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                size="sm"
                className="text-xs font-semibold"
              >
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
