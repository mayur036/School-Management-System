import { useRef, useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import StatusBadge from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { BASE, STATUS } from '@/lib/icons';
import { cn, formatDate } from '@/lib/utils';

import ChangePasswordDialog from '../components/ChangePasswordDialog';
import EditProfileDialog from '../components/EditProfileDialog';
import ProfileTabContent from '../components/ProfileTabContent';
import ProgressRing from '../components/ProgressRing';
import {
  ALLOWED_TYPES,
  MAX_SIZE,
  ROLE_LABELS,
  TABS_LIST,
} from '../constants/profile.constants';
import { useUploadAvatarMutation } from '../profile.api';
import { getBreadcrumbRoleLabel, getInitials } from '../utils/profile.utils';

export const ProfileView = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Mutations
  const [uploadAvatar, { isLoading: isUploadingAvatar }] =
    useUploadAvatarMutation();

  // Tab State
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileActiveSubView, setMobileActiveSubView] = useState(null); // 'profile', 'security', 'notifications', 'activity', 'preferences' or null for list

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Local-only profile preferences (no backend persistence yet).
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('');
  const [language, setLanguage] = useState('');

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <BASE.LOADER className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  const initials = getInitials(user);

  // Dynamic Profile Completion
  const completionItems = [
    {
      label: 'Basic Information',
      completed: !!user.first_name && !!user.last_name,
    },
    { label: 'Profile Photo', completed: !!user.avatar_url },
    { label: 'Contact Details', completed: !!user.phone },
    {
      label: 'Preferences Details',
      completed: !!bio && !!timezone && !!language,
    },
  ];
  const completedCount = completionItems.filter(
    (item) => item.completed
  ).length;
  const completionPercentage = Math.round(
    (completedCount / completionItems.length) * 100
  );

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please choose a JPEG, PNG, or WEBP image');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('Image must be 2 MB or smaller');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await uploadAvatar(formData).unwrap();
      toast.success('Profile photo updated successfully');
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update photo');
    }
  };

  const breadcrumbRoleLabel = getBreadcrumbRoleLabel(user.role_name);

  const userFullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          {
            label: breadcrumbRoleLabel,
            to:
              user.role_name === 'super_admin'
                ? '/super/dashboard'
                : user.role_name === 'staff'
                  ? '/staff/dashboard'
                  : '/school/dashboard',
          },
          { label: 'Profile Settings' },
        ]}
      />

      {/* ── Hero Profile Header Card ────────────────────────── */}
      <div className="border-border bg-card border-l-primary relative overflow-hidden rounded-2xl border border-l-4 shadow-sm">
        {/* Neutral Header Background Accent */}
        <div className="bg-muted/30 absolute top-0 left-0 h-24 w-full" />

        <div className="relative flex flex-col gap-6 px-6 pt-8 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            {/* Avatar block with camera upload button */}
            <div className="relative">
              <div
                onClick={() => user.avatar_url && setIsViewerOpen(true)}
                className={cn(
                  'group relative rounded-full',
                  user.avatar_url ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                <Avatar className="border-background size-24 border-4 shadow-md sm:size-28">
                  <AvatarImage
                    src={user.avatar_url || undefined}
                    alt={userFullName}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {user.avatar_url && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-transparent bg-black/40 text-xs font-semibold text-white opacity-0 transition-opacity select-none group-hover:opacity-100">
                    View
                  </div>
                )}
              </div>

              {/* Upload trigger button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-background absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full border shadow-xs transition-all hover:scale-105"
                title="Change profile picture"
              >
                {isUploadingAvatar ? (
                  <BASE.LOADER className="size-4 animate-spin" />
                ) : (
                  <BASE.CAMERA className="size-4" />
                )}
              </button>
            </div>

            {/* Profile Identity info */}
            <div className="flex flex-col leading-tight sm:mb-2">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-foreground text-2xl font-bold tracking-tight">
                  {userFullName}
                </h2>
                <StatusBadge status={user.status} />
              </div>
              <span className="text-muted-foreground mt-1 flex items-center justify-center gap-1.5 text-sm sm:justify-start">
                <BASE.SHIELD className="text-primary size-4" />
                {ROLE_LABELS[user.role_name] || user.role_name}
              </span>

              {/* Status details metadata row */}
              <div className="text-muted-foreground mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs sm:justify-start">
                <span className="flex items-center gap-1">
                  <BASE.CLOCK className="size-3.5" />
                  {user.last_login_at
                    ? `Last Login: ${formatDate(user.last_login_at, 'short-time')}`
                    : 'First session active'}
                </span>
                <span className="flex items-center gap-1">
                  <BASE.CALENDAR className="size-3.5" />
                  Joined: {formatDate(user.created_at, 'long')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit Profile & Password Actions */}
          <div className="flex w-full flex-row gap-3 sm:mb-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(true)}
              className="flex-1 cursor-pointer gap-2 rounded-xl text-xs sm:flex-initial sm:text-sm"
            >
              <BASE.USER className="size-4" />
              Edit Profile
            </Button>
            <Button
              onClick={() => setIsChangePasswordOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/95 flex-1 cursor-pointer gap-2 rounded-xl text-xs sm:flex-initial sm:text-sm"
            >
              <BASE.LOCK className="size-4" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Container (Adaptive Viewports) ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 1. LEFT SIDEBAR / MOBILE NAVIGATION DRILLDOWN (Span 3) */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Profile Completion Circular progress card */}
          <Card className="border-border bg-card border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <ProgressRing percentage={completionPercentage} />
              <div className="flex min-w-0 flex-col">
                <p className="text-foreground text-sm font-semibold">
                  Almost complete!
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Keep going to complete your account setup.
                </p>
              </div>
            </CardContent>
            {/* Steps Checklist */}
            <div className="space-y-2.5 border-t px-5 py-4">
              {completionItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-0.5 text-xs"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.completed ? (
                    <STATUS.ACTIVE className="size-4 shrink-0 font-bold text-emerald-500" />
                  ) : (
                    <button
                      onClick={() => {
                        if (item.label === 'Preferences Details') {
                          setActiveTab('preferences');
                          setMobileActiveSubView('preferences');
                          setTimeout(() => {
                            const el = document.getElementById(
                              'preferences-section'
                            );
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        } else if (item.label === 'Profile Photo') {
                          fileInputRef.current?.click();
                        } else {
                          setIsEditProfileOpen(true);
                        }
                      }}
                      className="text-primary flex shrink-0 cursor-pointer items-center gap-0.5 text-[11px] font-semibold hover:underline"
                    >
                      Complete
                      <BASE.CHEVRON_RIGHT className="size-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Desktop tab buttons list */}
          <Card className="border-border bg-card hidden border lg:block">
            <div className="flex flex-col space-y-0.5 p-1.5">
              {TABS_LIST.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground/80 hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <tab.icon className="size-4.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 2. MIDDLE VIEWPORT / MAIN TAB CONTROLS (Span 6 on Desktop) */}
        <div className="lg:col-span-6">
          {/* Mobile list navigation menu triggers */}
          {mobileActiveSubView === null ? (
            <div className="flex flex-col gap-3 lg:hidden">
              <Card className="border-border bg-card border p-2">
                <div className="flex flex-col divide-y">
                  {TABS_LIST.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMobileActiveSubView(tab.id)}
                      className="text-foreground/80 hover:bg-muted/30 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-sm font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className="text-primary size-4.5" />
                        {tab.label}
                      </div>
                      <BASE.CHEVRON_RIGHT className="text-muted-foreground size-4" />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Mobile Quick Actions list */}
              <Card className="border-border bg-card border p-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-col divide-y">
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="text-foreground/80 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-xs font-semibold"
                  >
                    Change Password
                    <BASE.CHEVRON_RIGHT className="text-muted-foreground size-4" />
                  </button>
                  <button className="text-foreground/80 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-xs font-semibold">
                    Export My Data
                    <BASE.CHEVRON_RIGHT className="text-muted-foreground size-4" />
                  </button>
                  <button className="text-foreground/80 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-xs font-semibold">
                    Logout All Devices
                    <BASE.CHEVRON_RIGHT className="text-destructive size-4" />
                  </button>
                </div>
              </Card>
            </div>
          ) : (
            // Mobile sub-view details panel
            <div className="flex flex-col gap-4 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileActiveSubView(null)}
                className="text-muted-foreground -ml-2 w-fit cursor-pointer gap-2"
              >
                <STATUS.INACTIVE className="size-4" />
                Back to Settings
              </Button>
              <ProfileTabContent
                tabId={mobileActiveSubView}
                user={user}
                bio={bio}
                timezone={timezone}
                language={language}
                setIsEditProfileOpen={setIsEditProfileOpen}
                setIsChangePasswordOpen={setIsChangePasswordOpen}
                setTimezone={setTimezone}
                setLanguage={setLanguage}
              />
            </div>
          )}

          {/* Desktop tabbed panel view container */}
          <div className="hidden lg:block">
            <ProfileTabContent
              tabId={activeTab}
              user={user}
              bio={bio}
              timezone={timezone}
              language={language}
              setIsEditProfileOpen={setIsEditProfileOpen}
              setIsChangePasswordOpen={setIsChangePasswordOpen}
              setTimezone={setTimezone}
              setLanguage={setLanguage}
            />
          </div>
        </div>

        {/* 3. RIGHT SIDEBAR: ACCOUNT SECURITY & RECENT ACTIVITIES (Span 3) */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Account Security details card */}
          <Card className="border-border bg-card border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Account Security
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col space-y-3.5 px-5 pb-4 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold">
                    Account Status
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[10px] capitalize">
                    {user.status}
                  </span>
                </div>
                <StatusBadge status={user.status} />
              </div>
              <div className="flex items-start justify-between gap-3 border-t pt-3">
                <span className="text-foreground font-semibold">
                  Last Updated
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {user.updated_at
                    ? formatDate(user.updated_at, 'medium-time')
                    : 'Never'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 border-t pt-3">
                <span className="text-foreground font-semibold">
                  Last Login
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {user.last_login_at
                    ? formatDate(user.last_login_at, 'medium-time')
                    : 'First session active'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-foreground font-semibold">Password</span>
                <span className="text-muted-foreground text-[10px]">
                  {user.password_last_changed_at || user.passwordLastChangedAt
                    ? `Changed ${formatDate(user.password_last_changed_at || user.passwordLastChangedAt, 'short')}`
                    : 'Not yet changed'}
                </span>
              </div>
            </div>
          </Card>

          {/* Recent activity timeline */}
          <Card className="border-border bg-card border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-6 text-center text-xs">
                <STATUS.ACTIVE className="size-7 opacity-40" />
                No recent activity to show.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Edit Profile Modal Dialog ────────────────────────── */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        user={user}
        bio={bio}
        timezone={timezone}
        language={language}
        onSuccess={({ bio, timezone, language }) => {
          setBio(bio);
          setTimezone(timezone);
          setLanguage(language);
        }}
      />

      {/* ── Change Password Modal Dialog ──────────────────────── */}
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />

      {/* ── Profile Image Viewer Dialog ────────────────────────── */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-md overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-lg">
          <DialogTitle className="sr-only">Profile Picture</DialogTitle>
          <DialogDescription className="sr-only">
            Full view of profile picture
          </DialogDescription>
          <div className="relative flex items-center justify-center">
            <img
              src={user.avatar_url}
              alt={userFullName}
              className="max-h-[80vh] w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileView;
