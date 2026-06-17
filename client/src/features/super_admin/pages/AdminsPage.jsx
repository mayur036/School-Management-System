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

import AdminsTable from '../components/admins/AdminsTable';
import AdminStatusToggle from '../components/admins/AdminStatusToggle';
import DeleteAdminAlert from '../components/admins/DeleteAdminAlert';
import { useGetSchoolAdminsQuery } from '../schoolAdmins.api';
import { useGetSchoolsQuery } from '../schools.api';

const AdminsPage = () => {
  // Controls State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useGetSchoolAdminsQuery({
    search: debouncedSearch,
    school_id: schoolFilter === 'all' ? 0 : Number(schoolFilter),
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const admins = useMemo(() => data?.data?.admins ?? [], [data]);

  const { data: schoolsData } = useGetSchoolsQuery();
  const schools = useMemo(() => schoolsData?.data?.schools ?? [], [schoolsData]);

  // Dialog states
  const [statusAdmin, setStatusAdmin] = useState(null);
  const [deleteAdmin, setDeleteAdmin] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return admins.slice(start, start + itemsPerPage);
  }, [admins, currentPage, itemsPerPage]);

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
          { label: 'School Admins' },
        ]}
      />

      {/* Search & Actions Bar (eSkooly style) */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search Input Box & Filters */}
        <div className="flex flex-col gap-4 flex-1 max-w-4xl sm:flex-row sm:items-end">
          {/* Search */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
              Search Admin
            </span>
            <div className="relative w-full">
              <BASE.SEARCH className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground/60 w-full rounded-lg border py-2 pr-4 pl-9 text-xs outline-none focus:ring-1 focus:ring-primary"
                placeholder="Type admin name, email or school..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* School Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-48">
            <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
              School
            </span>
            <Select
              value={schoolFilter}
              onValueChange={(val) => {
                setSchoolFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-card border-border text-foreground h-9 text-xs">
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Schools</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school.school_id} value={String(school.school_id)} className="text-xs">
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-36">
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
                <SelectItem value="all" className="text-xs">All Status</SelectItem>
                <SelectItem value="active" className="text-xs">Active</SelectItem>
                <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Action Button */}
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 shrink-0 cursor-pointer rounded-lg px-4 text-xs font-semibold shadow-xs transition-colors">
          + Register Admin
        </Button>
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
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {!isLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={admins.length}
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
