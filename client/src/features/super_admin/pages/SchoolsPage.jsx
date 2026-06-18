import { useEffect, useMemo, useState } from 'react';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BASE } from '@/lib/icons';

import CreateSchoolAdminDialog from '../components/schools/CreateSchoolAdminDialog';
import CreateSchoolDialog from '../components/schools/CreateSchoolDialog';
import EditSchoolDialog from '../components/schools/EditSchoolDialog';
import SchoolsTable from '../components/schools/SchoolsTable';
import SchoolStatusToggle from '../components/schools/SchoolStatusToggle';
import { useGetSchoolsQuery } from '../schools.api';

const SchoolsPage = () => {
  // Controls State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Queries
  const { data, isLoading, error } = useGetSchoolsQuery({
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const schools = useMemo(() => data?.data?.schools ?? [], [data]);

  // Dialog states
  const [statusSchool, setStatusSchool] = useState(null);
  const [adminSchool, setAdminSchool] = useState(null);
  const [editSchool, setEditSchool] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedSchools = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return schools.slice(start, start + itemsPerPage);
  }, [schools, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setCurrentPage(1);
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

      {/* Search & Actions Bar (eSkooly style) */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search Input Box & Filter */}
        <div className="flex max-w-2xl flex-1 flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
              Search School
            </span>
            <div className="relative w-full">
              <BASE.SEARCH className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-9 text-xs outline-none focus:ring-1"
                placeholder="Type school name or domain..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex w-full flex-col gap-1.5 sm:w-40">
            <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
              Status
            </span>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-card border-border text-foreground h-9 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="text-xs">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-xs">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Action Button */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 shrink-0 cursor-pointer rounded-lg px-4 text-xs font-semibold shadow-xs transition-colors"
        >
          + Register School
        </Button>
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
          onEditSchool={setEditSchool}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {!isLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={schools.length}
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
      <EditSchoolDialog
        school={editSchool}
        onClose={() => setEditSchool(null)}
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
