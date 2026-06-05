import { Eye, MoreVertical, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const INITIAL_STAFF = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Miller',
    email: 'j.miller@school.com',
    phone: '+1 555-0101',
    role: 'Teacher',
    department: 'Languages & Literature',
    status: 'active',
    joinedDate: '2026-02-01',
  },
  {
    id: 2,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'd.wilson@school.com',
    phone: '+1 555-0102',
    role: 'Teacher',
    department: 'Mathematics & Science',
    status: 'active',
    joinedDate: '2026-01-20',
  },
  {
    id: 3,
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 's.connor@school.com',
    phone: '+1 555-0103',
    role: 'Clerk',
    department: 'Administration & HR',
    status: 'active',
    joinedDate: '2026-01-10',
  },
  {
    id: 4,
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'm.brown@school.com',
    phone: '+1 555-0104',
    role: 'Teacher',
    department: 'Social Studies & Arts',
    status: 'inactive',
    joinedDate: '2026-03-05',
  },
];

const DEPARTMENTS = [
  'Mathematics & Science',
  'Languages & Literature',
  'Social Studies & Arts',
  'Administration & HR',
];

export const StaffPage = () => {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Toggle status
  const handleToggleStatus = (id) => {
    setStaffList((prev) =>
      prev.map((staff) => {
        if (staff.id === id) {
          const nextStatus = staff.status === 'active' ? 'inactive' : 'active';
          toast.success(
            `${staff.firstName} ${staff.lastName} is now ${nextStatus}`
          );
          return { ...staff, status: nextStatus };
        }
        return staff;
      })
    );
  };

  const filteredStaff = staffList.filter((staff) => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || staff.department === deptFilter;
    const matchesStatus =
      statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground text-sm">
            View, search, and manage registered staff members and roles.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/school/staff/register">
            <Plus className="h-4 w-4" />
            Register Staff
          </Link>
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Staff Directory</CardTitle>
          <CardDescription>
            A database of teachers, administration, and support staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border-border/50 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => {
                    const initials = `${staff.firstName[0]}${staff.lastName[0]}`;
                    return (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm leading-none font-semibold">
                                {staff.firstName} {staff.lastName}
                              </p>
                              <p className="text-muted-foreground text-xxs mt-0.5">
                                ID: STF-{staff.id}182
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{staff.email}</p>
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            {staff.phone}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">
                          {staff.department}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {staff.role}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              staff.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {staff.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setIsDetailsOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(staff.id)}
                                className="cursor-pointer"
                              >
                                Toggle Status (
                                {staff.status === 'active'
                                  ? 'Disable'
                                  : 'Enable'}
                                )
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Staff Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-106.25">
          {selectedStaff && (
            <div>
              <DialogHeader className="pb-4">
                <DialogTitle>Staff Details</DialogTitle>
                <DialogDescription>
                  Detailed metadata record for this employee.
                </DialogDescription>
              </DialogHeader>
              <div className="mb-4 flex flex-col items-center gap-3 border-b pb-4 text-center">
                <Avatar className="border-primary/20 h-16 w-16 border-2">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {selectedStaff.firstName[0]}
                    {selectedStaff.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg leading-none font-bold">
                    {selectedStaff.firstName} {selectedStaff.lastName}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {selectedStaff.role} ({selectedStaff.department})
                  </p>
                </div>
                <Badge
                  variant={
                    selectedStaff.status === 'active' ? 'default' : 'secondary'
                  }
                >
                  {selectedStaff.status}
                </Badge>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground font-medium">
                    Email
                  </span>
                  <span className="text-foreground col-span-2 break-all">
                    {selectedStaff.email}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground font-medium">
                    Phone
                  </span>
                  <span className="text-foreground col-span-2">
                    {selectedStaff.phone}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground font-medium">
                    School
                  </span>
                  <span className="text-foreground col-span-2">
                    Assigned School Tenant
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-muted-foreground font-medium">
                    Joined Date
                  </span>
                  <span className="text-foreground col-span-2">
                    {selectedStaff.joinedDate}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;
