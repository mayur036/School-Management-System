import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { SCHOOL_ADMIN } from '@/lib/icons';

import SchoolAdminSidebar from './Sidebar';

const SchoolAdminHeader = () => {
  const { user } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <header className="bg-background/80 sticky top-0 z-10 flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
      {/* Mobile: open the sidebar in a drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">School Admin navigation</SheetTitle>
          <SchoolAdminSidebar className="w-full border-r-0" />
        </SheetContent>
      </Sheet>

      <span className="font-semibold md:hidden">School Admin</span>

      <div className="ml-auto flex items-center gap-3">
        {user && (
          <span className="text-muted-foreground hidden text-sm sm:inline">
            {user.first_name} {user.last_name}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <SCHOOL_ADMIN.LOGOUT className="h-4 w-4" />
          {isLoggingOut ? 'Signing out...' : 'Logout'}
        </Button>
      </div>
    </header>
  );
};

export default SchoolAdminHeader;
