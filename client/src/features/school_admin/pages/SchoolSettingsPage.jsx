import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetSchoolSettingsQuery,
  useUpdateWorkingDaysMutation,
} from '@/features/school_admin/schedule.api';
import {
  useGetSchoolProfileQuery,
  useUpdateSchoolProfileMutation,
} from '@/features/school_admin/school.api';
import { BASE, SCHOOL_ADMIN } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import { updateSchoolSchema } from '@/schemas/school.schema';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SchoolSettingsPage = () => {
  const { data: profileData, isLoading: isProfileLoading } =
    useGetSchoolProfileQuery();
  const { data: settingsData, isLoading: isSettingsLoading } =
    useGetSchoolSettingsQuery();

  const [updateSchoolProfile, { isLoading: isUpdatingProfile }] =
    useUpdateSchoolProfileMutation();
  const [updateWorkingDays, { isLoading: isUpdatingSettings }] =
    useUpdateWorkingDaysMutation();

  const school = profileData?.data?.school;
  const workingDaysStr = settingsData?.data?.settings?.working_days || '';

  // Working days states
  const [selectedDays, setSelectedDays] = useState([]);

  // React Hook Form for profile details
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchoolSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  // Sync form states with API data
  useEffect(() => {
    if (school) {
      reset({
        name: school.name || '',
        email: school.email || '',
        phone: school.phone || '',
        address: school.address || '',
      });
    }
  }, [school, reset]);

  useEffect(() => {
    if (workingDaysStr) {
      setSelectedDays(workingDaysStr.split(','));
    }
  }, [workingDaysStr]);

  const handleProfileSubmit = async (data) => {
    try {
      await updateSchoolProfile({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        address: data.address.trim() || null,
      }).unwrap();
      toast.success('School profile updated successfully');
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to update school profile'
      );
    }
  };

  const handleWorkingDaysSubmit = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error('At least one working day must be selected');
      return;
    }
    // Maintain order of days
    const orderedDays = DAYS_OF_WEEK.filter((day) =>
      selectedDays.includes(day)
    );
    try {
      await updateWorkingDays({
        working_days: orderedDays.join(','),
      }).unwrap();
      toast.success('Timetable preferences updated successfully');
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to update working days'
      );
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCopyCode = () => {
    if (school?.code) {
      navigator.clipboard.writeText(school.code);
      toast.success('School code copied to clipboard');
    }
  };

  const isLoading = isProfileLoading || isSettingsLoading;

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'School Admin', to: '/school/dashboard' },
          { label: 'School Settings' },
        ]}
      />



      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 1. School Information Card (Left Column) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Card className="border-border bg-card relative overflow-hidden rounded-2xl border shadow-sm">
              {/* Background gradient blur */}
              <div className="bg-primary/5 absolute top-0 left-0 h-24 w-full border-b" />

              <CardContent className="relative flex flex-col items-center pt-10 text-center">
                {/* School Icon Circle */}
                <div className="bg-primary/10 border-background mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-4 shadow-md">
                  <SCHOOL_ADMIN.SCHOOL_PROFILE className="text-primary h-10 w-10" />
                </div>

                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  {school?.name || 'School Name'}
                </h2>
                <div className="mt-1 flex items-center gap-1.5">
                  <StatusBadge status={school?.status} />
                </div>

                {/* School Tenant Code box */}
                <div className="bg-muted/40 border-border/40 mt-6 flex w-full flex-col items-center gap-2 rounded-xl border p-4">
                  <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    School Identifier Code
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm font-bold tracking-widest">
                      {school?.code}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer rounded p-1 transition-colors"
                      title="Copy code"
                    >
                      <BASE.COPY className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Stats / Info rows */}
                <div className="mt-6 w-full space-y-3.5 border-t pt-5 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">
                      Registered On
                    </span>
                    <span className="text-foreground font-medium">
                      {school?.created_at
                        ? formatDate(school.created_at, 'long')
                        : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">
                      Total Workdays
                    </span>
                    <span className="text-foreground font-medium">
                      {selectedDays.length} / 7 days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. Settings Forms (Right Column) */}
          <div className="lg:col-span-8">
            <Card className="border-border bg-card rounded-2xl border shadow-sm">
              <Tabs defaultValue="general" className="w-full">
                <div className="border-b px-6 pt-4">
                  <TabsList className="bg-muted/60 mb-2 rounded-lg border p-1 shadow-xs">
                    <TabsTrigger
                      value="general"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2 text-xs font-semibold transition-all"
                    >
                      <SCHOOL_ADMIN.PROFILE className="mr-2 h-4 w-4" />
                      General Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="academic"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2 text-xs font-semibold transition-all"
                    >
                      <SCHOOL_ADMIN.TIMETABLE className="mr-2 h-4 w-4" />
                      Preferences
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* General Settings Tab content */}
                <TabsContent value="general" className="p-6">
                  <form
                    onSubmit={handleSubmit(handleProfileSubmit)}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-foreground text-base font-bold">
                        School Operational Details
                      </h3>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Configure public identity and main contact coordinates.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="school-name"
                          className="text-foreground text-xs font-bold"
                        >
                          School Name{' '}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="school-name"
                          type="text"
                          className="bg-background border-border"
                          placeholder="e.g. Greenwood Academy"
                          aria-invalid={!!errors.name}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-destructive mt-1 text-xs">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="school-email"
                          className="text-foreground text-xs font-bold"
                        >
                          Contact Email{' '}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="school-email"
                          type="email"
                          className="bg-background border-border"
                          placeholder="e.g. admin@school.com"
                          aria-invalid={!!errors.email}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-destructive mt-1 text-xs">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="school-phone"
                          className="text-foreground text-xs font-bold"
                        >
                          Telephone Number
                        </Label>
                        <Input
                          id="school-phone"
                          type="text"
                          className="bg-background border-border"
                          placeholder="e.g. 5550199201"
                          aria-invalid={!!errors.phone}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-destructive mt-1 text-xs">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="school-address"
                          className="text-foreground text-xs font-bold"
                        >
                          Physical Address{' '}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="school-address"
                          type="text"
                          className="bg-background border-border"
                          placeholder="e.g. 101 Learning Road, CA"
                          aria-invalid={!!errors.address}
                          {...register('address')}
                        />
                        {errors.address && (
                          <p className="text-destructive mt-1 text-xs">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end border-t pt-4">
                      <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <BASE.LOADER className="mr-2 h-4 w-4 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <BASE.SAVE className="mr-2 h-4 w-4" />
                            Save School Details
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Academic Preferences Tab content */}
                <TabsContent value="academic" className="p-6">
                  <form
                    onSubmit={handleWorkingDaysSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-foreground text-base font-bold">
                        Academic Calendar Setup
                      </h3>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Configure which days periods and timetable slots can be
                        assigned.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      <span className="text-foreground text-xs font-bold">
                        School Operational Days
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {DAYS_OF_WEEK.map((day) => {
                          const isChecked = selectedDays.includes(day);
                          return (
                            <div
                              key={day}
                              onClick={() => handleDayToggle(day)}
                              className={`border-border/60 hover:bg-muted/40 flex cursor-pointer items-center justify-between rounded-xl border p-4.5 transition-all select-none ${
                                isChecked
                                  ? 'bg-primary/5 border-primary/30 ring-primary/20 ring-1'
                                  : 'bg-background'
                              }`}
                            >
                              <span className="text-foreground text-xs font-semibold">
                                {day}
                              </span>
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                                  isChecked
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-border bg-background'
                                }`}
                              >
                                {isChecked && (
                                  <BASE.CHECK className="h-3.5 w-3.5 font-bold" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end border-t pt-4">
                      <Button
                        type="submit"
                        disabled={isUpdatingSettings}
                        className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold"
                      >
                        {isUpdatingSettings ? (
                          <>
                            <BASE.LOADER className="mr-2 h-4 w-4 animate-spin" />
                            Saving Preferences...
                          </>
                        ) : (
                          <>
                            <BASE.SAVE className="mr-2 h-4 w-4" />
                            Save Timetable Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSettingsPage;
