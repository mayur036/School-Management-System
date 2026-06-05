import {
  Bell,
  Building2,
  Calendar,
  FolderTree,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const ANNOUNCEMENTS = [
  {
    title: 'Final Term Exams Schedule',
    date: 'June 03, 2026',
    author: 'Principal Office',
    desc: 'The final examination schedules for all grades have been posted on the department boards. Please coordinate with invigilators.',
  },
  {
    title: 'Staff Meeting: Curriculum Alignment',
    date: 'May 30, 2026',
    author: 'Academic Dean',
    desc: 'Mandatory staff sync on Friday at 3:00 PM in the Main Conference Hall. We will discuss syllabus completions.',
  },
  {
    title: 'System Maintenance Window',
    date: 'May 25, 2026',
    author: 'IT Support',
    desc: 'The grading and attendance modules will undergo database patches this Saturday from 10:00 PM to Sunday 2:00 AM.',
  },
];

export const StaffDashboard = () => {
  const { user } = useAuth();
  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() ||
    'ST';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.first_name || 'Staff'}
        </h1>
        <p className="text-muted-foreground text-sm">
          Access your teaching dashboard, resources, and announcements.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">
              Staff Profile
            </CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {user?.role_name === 'staff'
                    ? 'Department Staff'
                    : user?.role_name}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-2 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="text-foreground truncate">{user?.email}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="text-foreground">
                  {user?.phone || 'Not provided'}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full text-xs" asChild>
              <Link to="/staff/profile">Manage Profile Settings</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tenancy & Scope Card */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">
              Academic Assignment
            </CardTitle>
            <CardDescription>Department and school details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-lg border">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Department</p>
                <p className="text-sm font-semibold">
                  {user?.department_name || 'Mathematics & Science'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t pt-3">
              <div className="bg-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-lg border">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Institution</p>
                <p className="text-sm font-semibold">
                  School ID: {user?.school_id || 'Primary Tenant'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Card */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">
              Useful Tools
            </CardTitle>
            <CardDescription>Quick system resources.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2 text-xs"
              asChild
            >
              <Link to="/staff/profile">
                <User className="h-4 w-4" />
                Profile Settings
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-start gap-2 text-xs"
              onClick={() => toast.success('Tasks module coming soon!')}
            >
              <Calendar className="h-4 w-4" />
              Calendar & Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bell className="text-primary h-5 w-5" />
            School Announcements
          </CardTitle>
          <CardDescription>
            Platform updates and notifications issued by administration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-border/60 divide-y">
            {ANNOUNCEMENTS.map((ann, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-primary/80 bg-primary/5 rounded-full px-2 py-0.5 font-semibold">
                    {ann.author}
                  </span>
                  <span>{ann.date}</span>
                </div>
                <h3 className="text-foreground text-sm font-bold">
                  {ann.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {ann.desc}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;
