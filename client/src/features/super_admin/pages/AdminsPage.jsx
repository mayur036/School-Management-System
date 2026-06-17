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
import { BASE } from '@/lib/icons';

import AdminsTable from '../components/admins/AdminsTable';
import AdminStatusToggle from '../components/admins/AdminStatusToggle';
import DeleteAdminAlert from '../components/admins/DeleteAdminAlert';
import { useGetSchoolAdminsQuery } from '../schoolAdmins.api';
import { exportAdminsToCsv } from '../utils/admins.utils';

const AdminsPage = () => {
  const { data, isLoading, error } = useGetSchoolAdminsQuery();
  const admins = useMemo(() => data?.data?.admins ?? [], [data]);

  // Dialog states
  const [statusAdmin, setStatusAdmin] = useState(null);
  const [deleteAdmin, setDeleteAdmin] = useState(null);

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
    filteredData: filteredAdmins,
    paginatedData: paginatedAdmins,
  } = useDataTable({
    data: admins,
    searchFilter: (admin, q) => {
      const nameStr = `${admin.first_name} ${admin.last_name}`.toLowerCase();
      const emailStr = (admin.email ?? '').toLowerCase();
      const schoolStr = (admin.school_name ?? '').toLowerCase();
      return (
        nameStr.includes(q) || emailStr.includes(q) || schoolStr.includes(q)
      );
    },
  });

  const handleExport = () => {
    if (!filteredAdmins.length) {
      toast.error('No admins found to export');
      return;
    }
    try {
      exportAdminsToCsv(filteredAdmins);
      toast.success('Admins exported successfully');
    } catch {
      toast.error('Failed to export admins');
    }
  };

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'Super Admin', to: '/super/dashboard' },
          { label: 'School Admins' },
        ]}
      />

      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            School Admins
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage administrators across all registered schools.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-fit cursor-pointer gap-2 rounded-xl font-semibold text-white shadow-sm">
          <BASE.PLUS className="size-4" />
          Register Admin
        </Button>
      </div>



      {/* ── Controls & Actions Bar ────────────────────────────── */}
      <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <BASE.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="bg-muted/40 border-border pl-9"
            placeholder="Search by name, email, or school..."
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
          {error.message || 'Failed to load school admins. Please try again.'}
        </div>
      )}

      {/* ── Main Data View (Table) ────────────────────── */}
      <div className="flex flex-col gap-4">
        <AdminsTable
          admins={paginatedAdmins}
          isLoading={isLoading}
          onToggleStatus={setStatusAdmin}
          onDeleteAdmin={setDeleteAdmin}
        />

        {!isLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={filteredAdmins.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="admins"
          />
        )}
      </div>

      {/* Dialogs */}
      <AdminStatusToggle
        admin={statusAdmin}
        onClose={() => setStatusAdmin(null)}
      />
      <DeleteAdminAlert
        admin={deleteAdmin}
        onClose={() => setDeleteAdmin(null)}
      />
    </div>
  );
};

export default AdminsPage;
