import { FolderTree, MoreVertical, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const INITIAL_DEPARTMENTS = [
  {
    id: 1,
    name: 'Mathematics & Science',
    code: 'MATH-SCI',
    staffCount: 12,
    status: 'active',
    date: '2026-01-15',
  },
  {
    id: 2,
    name: 'Languages & Literature',
    code: 'LANG-LIT',
    staffCount: 8,
    status: 'active',
    date: '2026-01-15',
  },
  {
    id: 3,
    name: 'Social Studies & Arts',
    code: 'SOC-ARTS',
    staffCount: 6,
    status: 'active',
    date: '2026-02-10',
  },
  {
    id: 4,
    name: 'Administration & HR',
    code: 'ADMIN-HR',
    staffCount: 4,
    status: 'active',
    date: '2026-01-05',
  },
];

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');

  const handleToggleStatus = (id) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === id) {
          const nextStatus = dept.status === 'active' ? 'inactive' : 'active';
          toast.success(`${dept.name} is now ${nextStatus}`);
          return { ...dept, status: nextStatus };
        }
        return dept;
      })
    );
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      toast.error('Department name is required!');
      return;
    }

    const code =
      newDeptName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase() +
      '-' +
      Math.floor(Math.random() * 90 + 10);

    const created = {
      id: Date.now(),
      name: newDeptName,
      code,
      staffCount: 0,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
    };

    setDepartments((prev) => [...prev, created]);
    setIsAddOpen(false);
    setNewDeptName('');
    toast.success('Department created successfully!');
  };

  const filteredDepts = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground text-sm">
            Create and organize academic and administrative departments.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">School Departments</CardTitle>
          <CardDescription>
            View all departments running within your school tenant scope.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 max-w-md">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search by department name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="border-border/50 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Code Identifier</TableHead>
                  <TableHead>Staff Members</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No departments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepts.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="text-sm font-semibold">
                        <div className="flex items-center gap-2">
                          <FolderTree className="text-primary h-4 w-4 shrink-0" />
                          <span>{dept.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dept.code}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {dept.staffCount} Registered
                      </TableCell>
                      <TableCell className="text-sm">{dept.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            dept.status === 'active' ? 'default' : 'secondary'
                          }
                        >
                          {dept.status}
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
                              onClick={() => handleToggleStatus(dept.id)}
                              className="cursor-pointer"
                            >
                              Toggle Status (
                              {dept.status === 'active'
                                ? 'Deactivate'
                                : 'Activate'}
                              )
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-106.25">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a department to register and organize teaching or
                administrative staff.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dept-name">Department Name</Label>
                <Input
                  id="dept-name"
                  placeholder="e.g. Physics & Chemistry, Accounts, IT Support"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Department</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
