import { useState } from 'react';

import CreateSchoolAdminDialog from '../components/CreateSchoolAdminDialog';
import CreateSchoolDialog from '../components/CreateSchoolDialog';
import SchoolsTable from '../components/SchoolsTable';
import SchoolStatusToggle from '../components/SchoolStatusToggle';
import { useGetSchoolsQuery } from '../schools.api';

const SchoolsPage = () => {
  const { data, isLoading, error } = useGetSchoolsQuery();
  const schools = data?.data?.schools ?? [];

  // Dialog state: the school object being acted on (null = closed)
  const [statusSchool, setStatusSchool] = useState(null);
  const [adminSchool, setAdminSchool] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Schools</h1>
          <p className="text-muted-foreground text-sm">
            Manage registered schools and their administrators.
          </p>
        </div>
        <CreateSchoolDialog
          externalOpen={createOpen}
          onExternalOpenChange={setCreateOpen}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {error.message || 'Failed to load schools. Please try again.'}
        </div>
      )}

      {/* Schools table */}
      <SchoolsTable
        schools={schools}
        isLoading={isLoading}
        onCreateClick={() => setCreateOpen(true)}
        onToggleStatus={setStatusSchool}
        onAddAdmin={setAdminSchool}
      />

      {/* Status toggle confirmation */}
      <SchoolStatusToggle
        school={statusSchool}
        onClose={() => setStatusSchool(null)}
      />

      {/* Create school admin dialog */}
      <CreateSchoolAdminDialog
        school={adminSchool}
        onClose={() => setAdminSchool(null)}
      />
    </div>
  );
};

export default SchoolsPage;
