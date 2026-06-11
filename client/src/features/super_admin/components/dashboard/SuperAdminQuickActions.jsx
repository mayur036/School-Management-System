import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ACTIONS, SUPER_ADMIN } from '@/lib/icons';

export const SuperAdminQuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-border bg-card flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
        <CardDescription>Shortcuts to common tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <Button
          variant="outline"
          className="border-primary/20 hover:bg-primary/5 hover:text-primary w-full justify-start"
          onClick={() => navigate('/super/schools')}
        >
          <ACTIONS.CREATE className="mr-2 h-4 w-4" />
          Add New School
        </Button>
        <Button
          variant="outline"
          className="border-primary/20 hover:bg-primary/5 hover:text-primary w-full justify-start"
          onClick={() => navigate('/super/admins')}
        >
          <SUPER_ADMIN.USERS className="mr-2 h-4 w-4" />
          Manage Admins
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuperAdminQuickActions;
