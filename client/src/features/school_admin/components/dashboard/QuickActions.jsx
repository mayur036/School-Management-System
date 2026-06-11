import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BASE, SCHOOL_ADMIN } from '@/lib/icons';

import CreateDepartmentDialog from '../departments/CreateDepartmentDialog';

// Shared tile styling for both link- and button-based actions.
const tileClass =
  'group flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/50';

const ActionTile = ({ Icon, chip, label, description }) => (
  <>
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${chip}`}
    >
      <Icon className="size-5" />
    </span>
    <span className="flex min-w-0 flex-col">
      <span className="text-foreground text-sm font-semibold">{label}</span>
      <span className="text-muted-foreground truncate text-xs">
        {description}
      </span>
    </span>
    <BASE.CHEVRON_RIGHT className="text-muted-foreground ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
  </>
);

const QuickActions = () => {
  const [deptOpen, setDeptOpen] = useState(false);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Link to="/school/staff/register" className={tileClass}>
          <ActionTile
            Icon={SCHOOL_ADMIN.REGISTER_STAFF}
            chip="bg-primary/10 text-primary"
            label="Register Staff"
            description="Add a new staff member"
          />
        </Link>

        <button
          type="button"
          onClick={() => setDeptOpen(true)}
          className={`${tileClass} cursor-pointer`}
        >
          <ActionTile
            Icon={SCHOOL_ADMIN.DEPARTMENTS}
            chip="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            label="Add Department"
            description="Create a new department"
          />
        </button>

        <Link to="/school/staff" className={tileClass}>
          <ActionTile
            Icon={SCHOOL_ADMIN.STAFF_LIST}
            chip="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            label="Staff Directory"
            description="View and manage all staff"
          />
        </Link>

        {/* Controlled dialog — trigger hidden, opened by the tile above. */}
        <CreateDepartmentDialog
          hideTrigger
          externalOpen={deptOpen}
          onExternalOpenChange={setDeptOpen}
        />
      </CardContent>
    </Card>
  );
};

export default QuickActions;
