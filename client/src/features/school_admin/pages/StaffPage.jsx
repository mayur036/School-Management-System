import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';
import { formatDate, formatPhoneNumber, formatStaffId } from '@/lib/utils';

import StaffStatusToggle from '../components/StaffStatusToggle';
import StaffTable from '../components/StaffTable';
import { useGetDepartmentsQuery } from '../departments.api';
import { useGetStaffQuery } from '../staff.api';

const StaffPage = () => {
  // Queries
  const {
    data: staffData,
    isLoading: staffLoading,
    error: staffError,
  } = useGetStaffQuery();
  const { data: deptData } = useGetDepartmentsQuery();

  const staff = useMemo(() => staffData?.data?.staff ?? [], [staffData]);
  const departments = useMemo(
    () => deptData?.data?.departments ?? [],
    [deptData]
  );

  // Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Active item states for dialogs & drawer details
  const [toggleMember, setToggleMember] = useState(null);
  const [detailMember, setDetailMember] = useState(null);

  // 1. Calculate Real-Time Stats
  const stats = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.status === 'active').length;
    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    const deptsCount = departments.length;

    const now = new Date();
    const joinedThisMonth = staff.filter((s) => {
      if (!s.created_at) return false;
      const date = new Date(s.created_at);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      total,
      active,
      activePct,
      deptsCount,
      joinedThisMonth,
    };
  }, [staff, departments]);

  // 2. Client-side Search and Filter logic
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      const idStr = formatStaffId(member.staff_id);
      const emailStr = (member.email ?? '').toLowerCase();
      const deptStr = (member.department_name ?? '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        fullName.includes(q) ||
        idStr.includes(q) ||
        emailStr.includes(q) ||
        deptStr.includes(q);

      const matchesStatus =
        statusFilter === 'all' || member.status === statusFilter;

      const matchesDept =
        deptFilter === 'all' || String(member.department_id) === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [staff, searchQuery, statusFilter, deptFilter]);

  // 4. Exporter to CSV
  const handleExport = () => {
    if (!filteredStaff.length) {
      toast.error('No staff records found to export');
      return;
    }
    try {
      const headers = [
        'Staff ID',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Department',
        'Status',
        'Registered Date',
      ];
      const rows = filteredStaff.map((s) => [
        formatStaffId(s.staff_id),
        s.first_name,
        s.last_name,
        s.email,
        s.phone ? formatPhoneNumber(s.phone) : '',
        s.department_name || 'Unassigned',
        s.status,
        s.created_at ? formatDate(s.created_at, 'short', 'sv-SE') : '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `staff_directory_${formatDate(new Date(), 'short', 'sv-SE').replace(/-/g, '')}.csv`
      );
      link.click();
      toast.success('Directory exported successfully');
    } catch {
      toast.error('Failed to export directory');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'School Admin', to: '/school/dashboard' },
          { label: 'Staff Directory' },
        ]}
      />

      {/* Page Title & Register Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Staff Directory
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View, manage, and register staff members for your departments.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2 shadow-sm transition-all"
        >
          <Link to="/school/staff/register">
            <COMMON.PLUS data-icon="inline-start" />
            Register Staff
          </Link>
        </Button>
      </div>

      {/* ── Stats Summary Grid ────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Staff */}
        <Card className="border-border bg-card border border-l-4 border-l-blue-500">
          <CardContent className="flex items-center gap-3 p-3.5 sm:gap-4 sm:p-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 sm:size-10 dark:bg-blue-500/20 dark:text-blue-400">
              <SCHOOL_ADMIN.STAFF_LIST className="size-4.5 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                Total Staff
              </span>
              <span className="text-foreground mt-0.5 text-xl leading-none font-bold sm:text-2xl">
                {stats.total}
              </span>
              <span className="text-muted-foreground mt-1 truncate text-[9px] sm:text-[10px]">
                All departments
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Staff */}
        <Card className="border-border bg-card border border-l-4 border-l-emerald-500">
          <CardContent className="flex items-center gap-3 p-3.5 sm:gap-4 sm:p-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 sm:size-10 dark:bg-emerald-500/20 dark:text-emerald-400">
              <COMMON.CHECK className="size-4.5 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                Active Staff
              </span>
              <span className="text-foreground mt-0.5 text-xl leading-none font-bold sm:text-2xl">
                {stats.active}
              </span>
              <span className="mt-1 truncate text-[9px] font-semibold text-emerald-600 sm:text-[10px] dark:text-emerald-400">
                {stats.activePct}% of total
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Departments Count */}
        <Card className="border-border bg-card border border-l-4 border-l-amber-500">
          <CardContent className="flex items-center gap-3 p-3.5 sm:gap-4 sm:p-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 sm:size-10 dark:bg-amber-500/20 dark:text-amber-400">
              <SCHOOL_ADMIN.DEPARTMENTS className="size-4.5 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                Departments
              </span>
              <span className="text-foreground mt-0.5 text-xl leading-none font-bold sm:text-2xl">
                {stats.deptsCount}
              </span>
              <span className="text-muted-foreground mt-1 truncate text-[9px] sm:text-[10px]">
                Academic & Admin
              </span>
            </div>
          </CardContent>
        </Card>

        {/* New This Month */}
        <Card className="border-border bg-card border border-l-4 border-l-purple-500">
          <CardContent className="flex items-center gap-3 p-3.5 sm:gap-4 sm:p-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 sm:size-10 dark:bg-purple-500/20 dark:text-purple-400">
              <SCHOOL_ADMIN.REGISTER_STAFF className="size-4.5 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                New This Month
              </span>
              <span className="text-foreground mt-0.5 text-xl leading-none font-bold sm:text-2xl">
                {stats.joinedThisMonth}
              </span>
              <span className="text-muted-foreground mt-1 truncate text-[9px] sm:text-[10px]">
                Recently joined
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Controls & Actions Bar ────────────────────────────── */}
      <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <COMMON.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="bg-muted/40 border-border pl-9"
            placeholder="Search staff by name, email, or department..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-border bg-card cursor-pointer gap-2"
              >
                <COMMON.FILTER data-icon="inline-start" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'all'}
                onCheckedChange={() => setStatusFilter('all')}
              >
                All Statuses
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'active'}
                onCheckedChange={() => setStatusFilter('active')}
              >
                Active Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'inactive'}
                onCheckedChange={() => setStatusFilter('inactive')}
              >
                Inactive Only
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuLabel>Filter Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={deptFilter === 'all'}
                onCheckedChange={() => setDeptFilter('all')}
              >
                All Departments
              </DropdownMenuCheckboxItem>
              {departments.map((dept) => (
                <DropdownMenuCheckboxItem
                  key={dept.department_id}
                  checked={deptFilter === String(dept.department_id)}
                  onCheckedChange={() =>
                    setDeptFilter(String(dept.department_id))
                  }
                >
                  {dept.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export CSV */}
          <Button
            variant="outline"
            className="border-border bg-card cursor-pointer gap-2"
            onClick={handleExport}
          >
            <COMMON.EXPORT data-icon="inline-start" />
            Export
          </Button>

          {/* Grid / List Layout Switcher */}
          <div className="border-border bg-muted/40 hidden items-center rounded-lg border p-0.5 sm:flex">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8 cursor-pointer rounded-md"
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              <COMMON.LIST_VIEW className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8 cursor-pointer rounded-md"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <COMMON.GRID_VIEW className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {staffError && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {staffError.message ||
            'Failed to load staff directory. Please try again.'}
        </div>
      )}

      {/* ── Main Data View (Table / Grid) ────────────────────── */}
      <div className="flex flex-col gap-4">
        <StaffTable
          staff={filteredStaff}
          isLoading={staffLoading}
          viewMode={viewMode}
          onViewDetails={setDetailMember}
          onToggleStatus={setToggleMember}
        />
      </div>

      {/* Status Toggle AlertDialog */}
      <StaffStatusToggle
        member={toggleMember}
        onClose={() => setToggleMember(null)}
      />

      {/* Staff Profile Detail Drawer */}
      <Drawer
        open={!!detailMember}
        onOpenChange={(open) => !open && setDetailMember(null)}
      >
        <DrawerContent className="mx-auto max-w-lg pb-6">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="text-xl font-semibold tracking-tight">
              Staff Profile
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-sm">
              Detailed information for this staff member account.
            </DrawerDescription>
          </DrawerHeader>

          {detailMember && (
            <div className="flex flex-col gap-6 p-6">
              {/* Profile Card Header */}
              <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
                <Avatar className="border-border size-20 border">
                  <AvatarImage
                    src={detailMember.avatar_url}
                    alt={`${detailMember.first_name} ${detailMember.last_name}`}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xl font-bold">
                    {`${detailMember.first_name?.[0] ?? ''}${detailMember.last_name?.[0] ?? ''}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h3 className="text-foreground text-lg font-semibold">
                    {detailMember.first_name} {detailMember.last_name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {detailMember.department_name || 'Unassigned'}
                    </Badge>
                    <Badge
                      className={
                        detailMember.status === 'active'
                          ? 'bg-success text-success-foreground'
                          : 'bg-destructive text-destructive-foreground'
                      }
                    >
                      {detailMember.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1.5 font-mono text-xs">
                    Staff ID: {formatStaffId(detailMember.staff_id)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Profile Info Details List */}
              <div className="flex flex-col gap-4">
                <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Account Details
                </h4>

                <dl className="grid gap-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-muted-foreground">First Name</dt>
                    <dd className="text-foreground col-span-2 font-medium">
                      {detailMember.first_name}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-muted-foreground">Last Name</dt>
                    <dd className="text-foreground col-span-2 font-medium">
                      {detailMember.last_name}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="text-foreground col-span-2 font-mono font-medium break-all">
                      {detailMember.email}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="text-foreground col-span-2 font-medium">
                      {detailMember.phone
                        ? formatPhoneNumber(detailMember.phone)
                        : '—'}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-muted-foreground">Registered</dt>
                    <dd className="text-foreground col-span-2 font-medium">
                      {formatDate(detailMember.created_at, 'medium-time')}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <DrawerClose asChild>
                  <Button variant="outline" className="cursor-pointer">
                    Close
                  </Button>
                </DrawerClose>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default StaffPage;
