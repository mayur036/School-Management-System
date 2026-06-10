import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';

import CreateSchoolAdminDialog from '../components/CreateSchoolAdminDialog';
import CreateSchoolDialog from '../components/CreateSchoolDialog';
import SchoolsTable from '../components/SchoolsTable';
import SchoolStatusToggle from '../components/SchoolStatusToggle';
import { useGetSchoolsQuery } from '../schools.api';
import { computeSchoolStats, exportSchoolsToCsv } from '../utils/schools.utils';

const SchoolsPage = () => {
  // Queries
  const { data, isLoading, error } = useGetSchoolsQuery();
  const schools = useMemo(() => data?.data?.schools ?? [], [data]);

  // Dialog states
  const [statusSchool, setStatusSchool] = useState(null);
  const [adminSchool, setAdminSchool] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Real-time headline stats
  const stats = useMemo(() => computeSchoolStats(schools), [schools]);

  // Client-side Search and Filter logic
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const nameStr = (school.name ?? '').toLowerCase();
      const domainStr = (school.domain ?? '').toLowerCase();
      const idStr = String(school.school_id).toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        nameStr.includes(q) || domainStr.includes(q) || idStr.includes(q);

      const matchesStatus =
        statusFilter === 'all' || school.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [schools, searchQuery, statusFilter]);

  // Paginated subset of filtered schools
  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSchools.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSchools, currentPage, itemsPerPage]);

  const handleExport = () => {
    if (!filteredSchools.length) {
      toast.error('No schools found to export');
      return;
    }
    try {
      exportSchoolsToCsv(filteredSchools);
      toast.success('Schools exported successfully');
    } catch {
      toast.error('Failed to export schools');
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
          { label: 'Super Admin', to: '/super/dashboard' },
          { label: 'Schools Management' },
        ]}
      />

      {/* Page Title & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Schools Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View, manage, and register new schools on the platform.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2 shadow-sm transition-all"
        >
          <COMMON.PLUS data-icon="inline-start" />
          Register School
        </Button>
      </div>

      {/* ── Stats Summary Grid ────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          Icon={COMMON.BUILDING}
          label="Total Schools"
          value={stats.total}
          subtext="All registered schools"
          accentClassName="border-l-blue-500"
          iconChipClassName="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <StatCard
          Icon={COMMON.CHECK}
          label="Active Schools"
          value={stats.active}
          subtext={`${stats.activePct}% of total`}
          subtextClassName="font-semibold text-emerald-600 dark:text-emerald-400"
          accentClassName="border-l-emerald-500"
          iconChipClassName="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        />
        <StatCard
          Icon={COMMON.X}
          label="Inactive Schools"
          value={stats.inactive}
          subtext="Currently suspended"
          accentClassName="border-l-amber-500"
          iconChipClassName="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
        />
        <StatCard
          Icon={SCHOOL_ADMIN.REGISTER_STAFF}
          label="New This Month"
          value={stats.joinedThisMonth}
          subtext="Recently onboarded"
          accentClassName="border-l-purple-500"
          iconChipClassName="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
        />
      </div>

      {/* ── Controls & Actions Bar ────────────────────────────── */}
      <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <COMMON.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="bg-muted/40 border-border pl-9"
            placeholder="Search schools by name or domain..."
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
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {error.message || 'Failed to load schools. Please try again.'}
        </div>
      )}

      {/* ── Main Data View (Table) ────────────────────── */}
      <div className="flex flex-col gap-4">
        <SchoolsTable
          schools={paginatedSchools}
          isLoading={isLoading}
          onToggleStatus={setStatusSchool}
          onAddAdmin={setAdminSchool}
        />

        {!isLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={filteredSchools.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="schools"
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateSchoolDialog
        externalOpen={createOpen}
        onExternalOpenChange={setCreateOpen}
      />
      <SchoolStatusToggle
        school={statusSchool}
        onClose={() => setStatusSchool(null)}
      />
      <CreateSchoolAdminDialog
        school={adminSchool}
        onClose={() => setAdminSchool(null)}
      />
    </div>
  );
};

export default SchoolsPage;
