import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMMON } from '@/lib/icons';
import { formatPhoneNumber } from '@/lib/utils';

import {
  languagePreference,
  timezonePreference,
} from '../constants/profile.constants';

const ProfileTabContent = ({
  tabId,
  user,
  bio,
  timezone,
  language,
  setIsEditProfileOpen,
  setIsChangePasswordOpen,
  setTimezone,
  setLanguage,
}) => {
  switch (tabId) {
    case 'profile':
      return (
        <div className="flex flex-col gap-6">
          {/* Personal Info Grid */}
          <Card className="border-border bg-card border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Your personal profile detail records.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditProfileOpen(true)}
                className="cursor-pointer gap-1.5 text-xs"
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-xs sm:grid-cols-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-semibold">
                    First Name
                  </span>
                  <span className="text-foreground mt-1 text-sm font-medium">
                    {user.first_name}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-semibold">
                    Last Name
                  </span>
                  <span className="text-foreground mt-1 text-sm font-medium">
                    {user.last_name || '—'}
                  </span>
                </div>
                <div className="col-span-2 flex flex-col sm:col-span-1">
                  <span className="text-muted-foreground font-semibold">
                    Email Address
                  </span>
                  <span className="text-foreground mt-1 text-sm font-medium break-all">
                    {user.email}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-semibold">
                    Phone Number
                  </span>
                  <span className="text-foreground mt-1 text-sm font-medium">
                    {formatPhoneNumber(user.phone) || 'Not configured'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-semibold">
                    Role Access
                  </span>
                  <Badge className="bg-primary/10 text-primary mt-1 w-fit border-none text-[9px] capitalize shadow-none">
                    {user.role_name?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-semibold">
                    Department
                  </span>
                  <Badge className="bg-muted text-muted-foreground mt-1 w-fit border-none text-[9px] shadow-none">
                    {user.department_name || 'Not assigned'}
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-semibold">
                    Time Zone
                  </span>
                  <span className="text-foreground mt-1 text-sm font-medium">
                    {timezone || 'Not set'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-semibold">
                    Language
                  </span>
                  <span className="text-foreground mt-1 text-sm font-medium">
                    {language || 'Not set'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About / Bio Panel */}
          <Card className="border-border bg-card border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold">About / Bio</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditProfileOpen(true)}
                className="cursor-pointer gap-1.5 text-xs"
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p
                className={`text-xs leading-relaxed ${
                  bio ? 'text-foreground' : 'text-muted-foreground italic'
                }`}
              >
                {bio || 'No bio added yet.'}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    case 'security':
      return (
        <Card className="border-border bg-card border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              Account Security Options
            </CardTitle>
            <CardDescription className="text-xs">
              Manage your credentials, 2-factor authentication, and login
              sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pb-5">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-semibold">
                  Password Update
                </span>
                <span className="text-muted-foreground mt-0.5 text-xs">
                  Keep your account secure with robust credentials.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangePasswordOpen(true)}
                className="cursor-pointer text-xs"
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-semibold">
                  Two-Factor Authentication
                </span>
                <span className="text-muted-foreground mt-0.5 text-xs">
                  Verification code required at login sessions.
                </span>
              </div>
              <Badge className="bg-muted text-muted-foreground border-none text-xs shadow-none">
                Not configured
              </Badge>
            </div>

            <div className="space-y-3 pt-1">
              <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                Active Device Sessions
              </h4>
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-6 text-center text-xs">
                <COMMON.SHIELD className="size-7 opacity-40" />
                Session tracking is coming soon.
              </div>
            </div>
          </CardContent>
        </Card>
      );
    case 'notifications':
      return (
        <Card className="border-border bg-card border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              Notification Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Select your preferred channels for system updates and messages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
            <div className="flex items-center justify-between py-2.5">
              <div className="flex flex-col">
                <span className="text-foreground text-xs font-semibold">
                  Email Notifications
                </span>
                <span className="text-muted-foreground mt-0.5 text-[10px]">
                  Send transaction details and report logs via email.
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="accent-primary size-4 rounded"
              />
            </div>
            <div className="flex items-center justify-between border-t py-2.5">
              <div className="flex flex-col">
                <span className="text-foreground text-xs font-semibold">
                  SMS Alerts
                </span>
                <span className="text-muted-foreground mt-0.5 text-[10px]">
                  Critical security changes or onboarding messages.
                </span>
              </div>
              <input
                type="checkbox"
                className="accent-primary size-4 rounded"
              />
            </div>
            <div className="flex items-center justify-between border-t py-2.5">
              <div className="flex flex-col">
                <span className="text-foreground text-xs font-semibold">
                  Weekly Activity Digest
                </span>
                <span className="text-muted-foreground mt-0.5 text-[10px]">
                  Consolidated summary report of school department actions.
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="accent-primary size-4 rounded"
              />
            </div>
          </CardContent>
        </Card>
      );
    case 'activity':
      return (
        <Card className="border-border bg-card border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              Activity Audit Logs
            </CardTitle>
            <CardDescription className="text-xs">
              Detailed chronological log of your profile actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10 text-center text-xs">
              <COMMON.ACTIVITY className="size-8 opacity-40" />
              Activity audit logs are coming soon.
            </div>
          </CardContent>
        </Card>
      );
    case 'preferences':
      return (
        <Card className="border-border bg-card border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">
              General Preferences
            </CardTitle>
            <CardDescription className="text-xs">
              Manage layout views and default values.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="defaultTimezone" className="font-semibold">
                Time Zone Preference
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="defaultTimezone" className="w-full text-xs">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezonePreference.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="defaultLanguage" className="font-semibold">
                Language Preference
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="defaultLanguage" className="w-full text-xs">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languagePreference.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
};

export default ProfileTabContent;
