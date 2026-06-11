import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
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
import { useDataTable } from '@/hooks/useDataTable';
import { ACTIONS, BASE } from '@/lib/icons';

import CreateSchoolAdminDialog from '../components/schools/CreateSchoolAdminDialog';
import CreateSchoolDialog from '../components/schools/CreateSchoolDialog';
import SchoolsTable from '../components/schools/SchoolsTable';
import SchoolStatusToggle from '../components/schools/SchoolStatusToggle';
import SuperAdminSchoolStatCards from '../components/schools/SuperAdminSchoolStatCards';
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

  // Real-time headline stats
  const stats = useMemo(() => computeSchoolStats(schools), [schools]);

  // Use the custom useDataTable hook
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    filteredData: filteredSchools,
    paginatedData: paginatedSchools,
  } = useDataTable({
    data: schools,
    searchFilter: (school, q) => {
      const nameStr = (school.name ?? '').toLowerCase();
      const domainStr = (school.domain ?? '').toLowerCase();
      const idStr = String(school.school_id).toLowerCase();
      return nameStr.includes(q) || domainStr.includes(q) || idStr.includes(q);
    },
  });

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
          <ACTIONS.CREATE data-icon="inline-start" />
          Register School
        </Button>
      </div>

      {/* ── Stats Summary Grid ────────────────────────────────── */}
      <SuperAdminSchoolStatCards stats={stats} isLoading={isLoading} />

      {/* ── Controls & Actions Bar ────────────────────────────── */}
      <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <BASE.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="bg-muted/40 border-border pl-9"
            placeholder="Search schools by name or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <BASE.FILTER data-icon="inline-start" />
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
            <BASE.DOWNLOAD data-icon="inline-start" />
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
