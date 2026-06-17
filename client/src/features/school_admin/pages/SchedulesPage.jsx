import { useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteStaffScheduleMutation,
  useGetSchoolPeriodsQuery,
  useGetSchoolSettingsQuery,
  useListSchoolSchedulesQuery,
} from '@/features/school_admin/schedule.api';
import { useGetStaffQuery } from '@/features/school_admin/staff.api';
import { BASE } from '@/lib/icons';

import { BulkScheduleDialog } from '../components/schedules/BulkScheduleDialog';
import { PeriodManager } from '../components/schedules/PeriodManager';
import { ScheduleDialog } from '../components/schedules/ScheduleDialog';
import { ScheduleGrid } from '../components/schedules/ScheduleGrid';
import SchedulesTable from '../components/schedules/SchedulesTable';
import { WorkingDaysConfig } from '../components/schedules/WorkingDaysConfig';

export const SchedulesPage = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Dialog pre-fill states
  const [prefilledDay, setPrefilledDay] = useState('Monday');
  const [prefilledPeriodId, setPrefilledPeriodId] = useState('');

  // Table filters search
  const [tableSearch, setTableSearch] = useState('');
  const [tableStaffFilter, setTableStaffFilter] = useState('all');
  const [tableDayFilter, setTableDayFilter] = useState('all');

  // Queries & Mutations
  const { data: staffData, isLoading: isStaffLoading } = useGetStaffQuery();
  const { data: periodsData } = useGetSchoolPeriodsQuery();
  const { data: settingsData } = useGetSchoolSettingsQuery();
  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useListSchoolSchedulesQuery();
  const [deleteSchedule] = useDeleteStaffScheduleMutation();

  const staffMembers = staffData?.data?.staff || [];
  const periods = periodsData?.data?.periods || [];
  const settings = settingsData?.data?.settings || {};
  const schedules = schedulesData?.data?.schedules || [];

  const workingDays = settings.working_days
    ? settings.working_days.split(',').map((d) => d.trim())
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Add timetable slot click from Grid cell
  const handleAddSlotFromGrid = (day, periodId) => {
    setEditingSchedule(null);
    setPrefilledDay(day);
    setPrefilledPeriodId(periodId);
    setIsScheduleOpen(true);
  };

  // Add timetable slot click from Header button
  const handleAddSlotHeader = () => {
    setEditingSchedule(null);
    setPrefilledDay('Monday');
    setPrefilledPeriodId('');
    setIsScheduleOpen(true);
  };

  // Edit slot click
  const handleEditSlot = (schedule) => {
    setEditingSchedule(schedule);
    setIsScheduleOpen(true);
  };

  // Delete slot click
  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule entry?'))
      return;
    try {
      await deleteSchedule(id).unwrap();
      toast.success('Schedule entry deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete schedule entry');
    }
  };

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'School Admin', to: '/school/dashboard' },
          { label: 'Timetable Schedules' },
        ]}
      />

      {/* Search & Actions Bar (eSkooly style) */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search Input Box */}
        <div className="flex w-full max-w-md flex-1 flex-col gap-1.5">
          <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
            Search Timetable
          </span>
          <div className="relative w-full">
            <BASE.SEARCH className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              type="text"
              className="bg-card border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary w-full cursor-not-allowed rounded-lg border py-2 pr-4 pl-9 text-xs opacity-75 outline-none focus:ring-1"
              placeholder="Type subject or class..."
              disabled
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsBulkOpen(true)}
            className="border-border bg-card hover:bg-muted/30 h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold shadow-xs transition-colors"
            disabled={staffMembers.length === 0}
          >
            Copy Template
          </Button>

          <Button
            onClick={handleAddSlotHeader}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold shadow-xs transition-colors"
            disabled={staffMembers.length === 0 || periods.length === 0}
          >
            + Add Slot
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="border-border flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between sm:pb-1">
          <div className="-mx-4 w-full scrollbar-none overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:px-0">
            <TabsList className="bg-muted/60 flex w-fit min-w-max p-0.5">
              <TabsTrigger
                value="grid"
                className="h-7 px-4 text-xs font-medium"
              >
                Weekly Grid View
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="h-7 px-4 text-xs font-medium"
              >
                List Table View
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="h-7 px-4 text-xs font-medium"
              >
                Timetable Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Grid Staff Selection Dropdown (Only visible on Grid Tab) */}
          {activeTab === 'grid' && (
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
              <Label className="text-muted-foreground hidden text-xs font-semibold sm:inline">
                View Schedule For:
              </Label>
              <Select
                value={selectedStaffId}
                onValueChange={setSelectedStaffId}
              >
                <SelectTrigger className="bg-card h-8.5 w-full text-xs font-medium sm:w-52">
                  <SelectValue placeholder="Select Staff Member" />
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
          )}
        </div>

        {/* Tab Content: Grid */}
        <TabsContent value="grid" className="m-0 focus-visible:ring-0">
          {isSchedulesLoading || isStaffLoading ? (
            <div className="space-y-4">
              <Skeleton className="bg-muted h-10 w-full animate-pulse rounded-xl" />
              <Skeleton className="bg-muted h-80 w-full animate-pulse rounded-xl" />
            </div>
          ) : (
            <ScheduleGrid
              periods={periods}
              workingDays={workingDays}
              schedules={schedules}
              staffId={selectedStaffId}
              onAddSlot={handleAddSlotFromGrid}
              onEditSlot={handleEditSlot}
              onDeleteSlot={handleDeleteSlot}
            />
          )}
        </TabsContent>

        {/* Tab Content: Table */}
        <TabsContent value="table" className="m-0 focus-visible:ring-0">
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            {/* Filters Bar */}
            <div className="border-border border-b p-4.5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="flex-1">
                  <Input
                    placeholder="Search by subject, class, or room..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Filter Staff */}
                <div className="w-full sm:w-44">
                  <Select
                    value={tableStaffFilter}
                    onValueChange={setTableStaffFilter}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Filter Staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">
                        All Staff
                      </SelectItem>
                      {staffMembers.map((m) => (
                        <SelectItem
                          key={m.staff_id}
                          value={String(m.staff_id)}
                          className="text-xs"
                        >
                          {m.first_name} {m.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Day */}
                <div className="w-full sm:w-40">
                  <Select
                    value={tableDayFilter}
                    onValueChange={setTableDayFilter}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Filter Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">
                        All Days
                      </SelectItem>
                      {workingDays.map((d) => (
                        <SelectItem key={d} value={d} className="text-xs">
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <SchedulesTable
              search={tableSearch}
              staffFilter={tableStaffFilter}
              dayFilter={tableDayFilter}
              onEdit={handleEditSlot}
            />
          </div>
        </TabsContent>

        {/* Tab Content: Settings */}
        <TabsContent
          value="settings"
          className="m-0 space-y-6 focus-visible:ring-0"
        >
          <WorkingDaysConfig />
          <PeriodManager />
        </TabsContent>
      </Tabs>

      {/* dialogs */}
      <ScheduleDialog
        isOpen={isScheduleOpen}
        setIsOpen={setIsScheduleOpen}
        editingSchedule={editingSchedule}
        staffMembers={staffMembers}
        periods={periods}
        schedules={schedules}
        activeStaffId={selectedStaffId}
        activeDay={prefilledDay}
        activePeriodId={prefilledPeriodId}
        onDelete={handleDeleteSlot}
      />

      <BulkScheduleDialog
        isOpen={isBulkOpen}
        setIsOpen={setIsBulkOpen}
        staffMembers={staffMembers}
        schedules={schedules}
      />
    </div>
  );
};

export default SchedulesPage;
