import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useBulkCreateStaffSchedulesMutation,
  useDeleteStaffScheduleMutation,
} from '@/features/school_admin/schedule.api';

export const BulkScheduleDialog = ({
  isOpen,
  setIsOpen,
  staffMembers = [],
  schedules = [],
}) => {
  const [sourceStaffId, setSourceStaffId] = useState('');
  const [destStaffId, setDestStaffId] = useState('');
  const [clearExisting, setClearExisting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  // Mutations
  const [bulkCreateSchedules] = useBulkCreateStaffSchedulesMutation();
  const [deleteSchedule] = useDeleteStaffScheduleMutation();

  // Filter schedules belonging to the selected source staff
  const sourceSchedules = schedules.filter(
    (s) => s.staff_id === Number(sourceStaffId)
  );

  const handleCopy = async () => {
    if (!sourceStaffId) {
      toast.error('Please select a source staff member');
      return;
    }
    if (!destStaffId) {
      toast.error('Please select a destination staff member');
      return;
    }
    if (sourceStaffId === destStaffId) {
      toast.error('Source and destination staff members must be different');
      return;
    }
    if (sourceSchedules.length === 0) {
      toast.error(
        'The selected source staff member has no schedule entries to copy'
      );
      return;
    }

    setIsCopying(true);
    try {
      // 1. If clearExisting is checked, delete all schedules of the destination staff member first
      if (clearExisting) {
        const destSchedules = schedules.filter(
          (s) => s.staff_id === Number(destStaffId)
        );
        for (const item of destSchedules) {
          await deleteSchedule(item.schedule_id).unwrap();
        }
      }

      // 2. Prepare bulk payload (only copy fields: period_id, subject_name, class_name, day_of_week, room)
      const entries = sourceSchedules.map((s) => ({
        period_id: s.period_id,
        subject_name: s.subject_name,
        class_name: s.class_name,
        day_of_week: s.day_of_week,
        room: s.room || '',
      }));

      const payload = {
        staff_id: Number(destStaffId),
        entries,
      };

      const res = await bulkCreateSchedules(payload).unwrap();
      toast.success(res.message || 'Timetable template applied successfully');
      setIsOpen(false);
      resetState();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to copy timetable schedule');
    } finally {
      setIsCopying(false);
    }
  };

  const resetState = () => {
    setSourceStaffId('');
    setDestStaffId('');
    setClearExisting(false);
  };

  const handleClose = () => {
    resetState();
    setIsOpen(false);
  };

  const destStaff = staffMembers.find(
    (m) => m.staff_id === Number(destStaffId)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-110 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground text-base font-bold">
            Copy Timetable Template
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Duplicate a complete weekly timetable schedule from one teacher to
            another.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Source Staff Dropdown */}
          <div className="space-y-1">
            <Label className="text-foreground text-xs font-semibold">
              Source Staff (Template)
            </Label>
            <Select value={sourceStaffId} onValueChange={setSourceStaffId}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select teacher schedule to copy" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((member) => (
                  <SelectItem
                    key={member.staff_id}
                    value={String(member.staff_id)}
                    className="text-xs"
                  >
                    {member.first_name} {member.last_name || ''} (
                    {member.department_name || 'Staff'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Preview */}
          {sourceStaffId && (
            <div className="border-border bg-muted/20 rounded-lg border p-3 text-xs">
              <span className="text-foreground font-semibold">
                Template Preview ({sourceSchedules.length} slots):
              </span>
              {sourceSchedules.length > 0 ? (
                <div className="text-muted-foreground mt-2 max-h-32 space-y-1.5 overflow-y-auto pr-1 text-[11px] font-medium">
                  {sourceSchedules.map((s) => (
                    <div
                      key={s.schedule_id}
                      className="border-border/40 flex items-center justify-between border-b pb-1"
                    >
                      <span>
                        {s.day_of_week} · {s.period_name} (
                        {s.start_time.substring(0, 5)} -{' '}
                        {s.end_time.substring(0, 5)})
                      </span>
                      <span className="text-foreground font-semibold">
                        {s.subject_name} ({s.class_name}){' '}
                        {s.room ? `· Room ${s.room}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-red-500">
                  This teacher has no schedules assigned. Select another source.
                </p>
              )}
            </div>
          )}

          {/* Destination Staff Dropdown */}
          <div className="space-y-1">
            <Label className="text-foreground text-xs font-semibold">
              Destination Staff (Target)
            </Label>
            <Select value={destStaffId} onValueChange={setDestStaffId}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select teacher to apply template to" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers
                  .filter((m) => m.staff_id !== Number(sourceStaffId))
                  .map((member) => (
                    <SelectItem
                      key={member.staff_id}
                      value={String(member.staff_id)}
                      className="text-xs"
                    >
                      {member.first_name} {member.last_name || ''} (
                      {member.department_name || 'Staff'})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          {destStaffId && (
            <div className="bg-muted/10 flex items-center space-x-2.5 rounded-lg border p-3 shadow-2xs">
              <Checkbox
                id="clear-existing"
                checked={clearExisting}
                onCheckedChange={setClearExisting}
              />
              <div className="grid gap-0.5 leading-none">
                <Label
                  htmlFor="clear-existing"
                  className="text-foreground cursor-pointer text-xs font-semibold"
                >
                  Clear existing schedule for destination staff
                </Label>
                <p className="text-muted-foreground text-[10px]">
                  Deletes all current slots assigned to {destStaff?.first_name}{' '}
                  before copying.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            className="text-xs"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="text-xs font-semibold"
            onClick={handleCopy}
            disabled={
              isCopying ||
              !sourceStaffId ||
              !destStaffId ||
              sourceSchedules.length === 0
            }
          >
            {isCopying ? 'Applying...' : 'Apply Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
