import { useState } from 'react';

import CreateDepartmentDialog from '../components/CreateDepartmentDialog';
import DepartmentsTable from '../components/DepartmentsTable';
import { useGetDepartmentsQuery } from '../departments.api';

const DepartmentsPage = () => {
  const { data, isLoading, error } = useGetDepartmentsQuery();
  const departments = data?.data?.departments ?? [];
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="text-muted-foreground text-sm">
            Manage academic and administrative departments for your school.
          </p>
        </div>
        <CreateDepartmentDialog
          externalOpen={createOpen}
          onExternalOpenChange={setCreateOpen}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {error.message || 'Failed to load departments. Please try again.'}
        </div>
      )}

      {/* Departments Table / List */}
      <DepartmentsTable
        departments={departments}
        isLoading={isLoading}
        onCreateClick={() => setCreateOpen(true)}
      />
    </div>
  );
};

export default DepartmentsPage;
