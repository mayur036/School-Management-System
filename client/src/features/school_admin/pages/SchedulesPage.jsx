import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteStaffScheduleMutation,
  useGetSchoolPeriodsQuery,
  useGetSchoolSettingsQuery,
  useListSchoolSchedulesQuery,
} from '@/features/school_admin/schedule.api';
import { useGetStaffQuery } from '@/features/school_admin/staff.api';
import { ACTIONS, BASE, EMPTY_STATE } from '@/lib/icons';

import { BulkScheduleDialog } from '../components/schedules/BulkScheduleDialog';
import { PeriodManager } from '../components/schedules/PeriodManager';
import { ScheduleDialog } from '../components/schedules/ScheduleDialog';
import { ScheduleGrid } from '../components/schedules/ScheduleGrid';
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
  const [deleteSchedule, { isLoading: isDeleting }] =
    useDeleteStaffScheduleMutation();

  const staffMembers = staffData?.data?.staff || [];
  const periods = periodsData?.data?.periods || [];
  const settings = settingsData?.data?.settings || {};
  const schedules = schedulesData?.data?.schedules || [];

  console.log({ settings });

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

  // Table filter logic
  const filteredSchedules = schedules.filter((item) => {
    const matchesSearch =
      item.subject_name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.class_name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      (item.room &&
        item.room.toLowerCase().includes(tableSearch.toLowerCase()));

    const matchesStaff =
      tableStaffFilter === 'all' || item.staff_id === Number(tableStaffFilter);

    const matchesDay =
      tableDayFilter === 'all' || item.day_of_week === tableDayFilter;

    return matchesSearch && matchesStaff && matchesDay;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Staff Timetable Manager
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure periods, working days, and assign weekly teaching
            schedules for school staff.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsBulkOpen(true)}
            className="h-9 flex-1 py-1.5 text-xs font-semibold sm:flex-initial"
            disabled={staffMembers.length === 0}
          >
            <BASE.COPY className="mr-1.5 h-4 w-4" /> Copy Template
          </Button>

          <Button
            onClick={handleAddSlotHeader}
            className="h-9 flex-1 py-1.5 text-xs font-semibold sm:flex-initial"
            disabled={staffMembers.length === 0 || periods.length === 0}
          >
            <ACTIONS.CREATE className="mr-1.5 h-4 w-4" /> Add Slot
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
          <Card className="border-border bg-card shadow-sm">
            {/* Filters Bar */}
            <CardHeader className="border-border border-b pb-3">
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
            </CardHeader>

            {/* Table Records */}
            <CardContent className="pt-4">
              {isSchedulesLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="bg-muted h-8 w-full animate-pulse rounded"
                    />
                  ))}
                </div>
              ) : filteredSchedules.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-xs font-semibold">
                          Staff Member
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Department
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Subject
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Class / Room
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Day
                        </TableHead>
                        <TableHead className="text-xs font-semibold">
                          Time Period
                        </TableHead>
                        <TableHead className="w-24 text-right text-xs font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedules.map((item) => (
                        <TableRow
                          key={item.schedule_id}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="text-foreground text-xs font-semibold">
                            {item.staff_name}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {item.department_name || 'Staff'}
                          </TableCell>
                          <TableCell className="text-foreground text-xs font-semibold">
                            {item.subject_name}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {item.class_name}{' '}
                            {item.room ? `· Room ${item.room}` : ''}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {item.day_of_week}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {item.period_name} (
                            {item.start_time.substring(0, 5)} -{' '}
                            {item.end_time.substring(0, 5)})
                          </TableCell>
                          <TableCell className="space-x-1 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:text-primary h-7 w-7 rounded p-0 text-slate-400"
                              onClick={() => handleEditSlot(item)}
                            >
                              <ACTIONS.EDIT className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 rounded p-0 text-slate-400 hover:text-red-500"
                              disabled={isDeleting}
                              onClick={() => handleDeleteSlot(item.schedule_id)}
                            >
                              <ACTIONS.DELETE className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
                  <h3 className="text-foreground text-sm font-semibold">
                    No Schedule Entries Found
                  </h3>
                  <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                    Try modifying your search or filter values to find records.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
