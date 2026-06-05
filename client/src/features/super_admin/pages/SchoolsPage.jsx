import { Building2, MoreVertical, Plus, Search, UserPlus } from 'lucide-react';
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
  DropdownMenuSeparator,
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

const INITIAL_SCHOOLS = [
  {
    id: 1,
    name: 'Greenwood International School',
    code: 'GWIS',
    email: 'contact@greenwood.edu',
    phone: '+1 555-0199',
    address: '123 Education Way, Boston MA',
    status: 'active',
    adminName: 'Alice Johnson',
    adminEmail: 'alice.j@greenwood.edu',
  },
  {
    id: 2,
    name: 'Oakridge Academy',
    code: 'OAKR',
    email: 'admin@oakridge.org',
    phone: '+1 555-0144',
    address: '456 Learning Blvd, Chicago IL',
    status: 'active',
    adminName: 'Robert Smith',
    adminEmail: 'r.smith@oakridge.org',
  },
  {
    id: 3,
    name: 'Pinecrest High School',
    code: 'PINE',
    email: 'info@pinecrest.school',
    phone: '+1 555-0168',
    address: '789 Pine Dr, Seattle WA',
    status: 'inactive',
    adminName: 'Pending',
    adminEmail: '',
  },
];

export const SchoolsPage = () => {
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog states
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Form states
  const [newSchool, setNewSchool] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
  });

  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Toggle status
  const handleToggleStatus = (id) => {
    setSchools((prev) =>
      prev.map((school) => {
        if (school.id === id) {
          const nextStatus = school.status === 'active' ? 'inactive' : 'active';
          toast.success(`${school.name} is now ${nextStatus}`);
          return { ...school, status: nextStatus };
        }
        return school;
      })
    );
  };

  // Add School submit
  const handleAddSchoolSubmit = (e) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.code) {
      toast.error('Name and Code are required!');
      return;
    }

    const created = {
      id: Date.now(),
      ...newSchool,
      status: 'active',
      adminName: 'Pending',
      adminEmail: '',
    };

    setSchools((prev) => [created, ...prev]);
    setIsAddSchoolOpen(false);
    setNewSchool({ name: '', code: '', email: '', phone: '', address: '' });
    toast.success('School registered successfully!');
  };

  // Add Admin submit
  const handleAddAdminSubmit = (e) => {
    e.preventDefault();
    if (!newAdmin.firstName || !newAdmin.email) {
      toast.error('First Name and Email are required!');
      return;
    }

    setSchools((prev) =>
      prev.map((school) => {
        if (school.id === selectedSchool.id) {
          return {
            ...school,
            adminName: `${newAdmin.firstName} ${newAdmin.lastName}`,
            adminEmail: newAdmin.email,
          };
        }
        return school;
      })
    );

    setIsAddAdminOpen(false);
    setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
    toast.success(`Admin assigned to ${selectedSchool.name}!`);
  };

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || school.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schools</h1>
          <p className="text-muted-foreground text-sm">
            Manage educational institutions and assign school administrators.
          </p>
        </div>
        <Button onClick={() => setIsAddSchoolOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add School
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Registered Schools</CardTitle>
          <CardDescription>
            A list of all school accounts under the EduManage platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search by school name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('inactive')}
                size="sm"
              >
                Inactive
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border-border/50 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>School Admin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No schools found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/5 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm leading-none font-semibold">
                              {school.name}
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              Code: {school.code}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{school.email}</p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {school.phone}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p
                          className="max-w-50 truncate text-sm"
                          title={school.address}
                        >
                          {school.address}
                        </p>
                      </TableCell>
                      <TableCell>
                        {school.adminName === 'Pending' ? (
                          <span className="text-muted-foreground text-sm italic">
                            Pending Assign
                          </span>
                        ) : (
                          <div>
                            <p className="text-sm font-medium">
                              {school.adminName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {school.adminEmail}
                            </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            school.status === 'active' ? 'default' : 'secondary'
                          }
                        >
                          {school.status}
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
                                setSelectedSchool(school);
                                setIsAddAdminOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Assign/Edit Admin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(school.id)}
                              className="cursor-pointer"
                            >
                              Toggle Status (
                              {school.status === 'active'
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

      {/* Add School Dialog */}
      <Dialog open={isAddSchoolOpen} onOpenChange={setIsAddSchoolOpen}>
        <DialogContent className="sm:max-w-106.25">
          <form onSubmit={handleAddSchoolSubmit}>
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
              <DialogDescription>
                Register a new school tenant on the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  placeholder="Greenwood Academy"
                  value={newSchool.name}
                  onChange={(e) =>
                    setNewSchool({ ...newSchool, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-code">School Code</Label>
                <Input
                  id="school-code"
                  placeholder="GWAC"
                  maxLength={10}
                  value={newSchool.code}
                  onChange={(e) =>
                    setNewSchool({
                      ...newSchool,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-email">Contact Email</Label>
                <Input
                  id="school-email"
                  type="email"
                  placeholder="info@school.com"
                  value={newSchool.email}
                  onChange={(e) =>
                    setNewSchool({ ...newSchool, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-phone">Contact Phone</Label>
                <Input
                  id="school-phone"
                  placeholder="+1 555-0100"
                  value={newSchool.phone}
                  onChange={(e) =>
                    setNewSchool({ ...newSchool, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-address">Address</Label>
                <Input
                  id="school-address"
                  placeholder="123 Main St, City State"
                  value={newSchool.address}
                  onChange={(e) =>
                    setNewSchool({ ...newSchool, address: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddSchoolOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create School</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add School Admin Dialog */}
      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent className="sm:max-w-106.25">
          <form onSubmit={handleAddAdminSubmit}>
            <DialogHeader>
              <DialogTitle>Assign School Administrator</DialogTitle>
              <DialogDescription>
                Assign or replace the administrator for{' '}
                <span className="text-foreground font-semibold">
                  {selectedSchool?.name}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="admin-fname">First Name</Label>
                  <Input
                    id="admin-fname"
                    placeholder="John"
                    value={newAdmin.firstName}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-lname">Last Name</Label>
                  <Input
                    id="admin-lname"
                    placeholder="Doe"
                    value={newAdmin.lastName}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="john.doe@school.com"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-password">Initial Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddAdminOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Assign Admin</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolsPage;
