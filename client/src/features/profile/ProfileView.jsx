import { useRef, useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getMetrics } from '@/helper/getMatrics';
import { useAuth } from '@/hooks/useAuth';
import { COMMON } from '@/lib/icons';

import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from './profile.api';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  school_admin: 'School Administrator',
  staff: 'Department Staff',
};

// Circular Progress Component
const ProgressRing = ({ percentage }) => {
  const radius = 45;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90 transform"
      >
        <circle
          stroke="hsl(var(--muted)/0.4)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="hsl(var(--primary))"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <span className="text-foreground absolute text-sm font-bold">
        {percentage}%
      </span>
    </div>
  );
};

export const ProfileView = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Mutations
  const [uploadAvatar, { isLoading: isUploadingAvatar }] =
    useUploadAvatarMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Tab State
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileActiveSubView, setMobileActiveSubView] = useState(null); // 'profile', 'security', 'notifications', 'activity', 'preferences' or null for list

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Edit Profile Form States
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Change Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Dummy states for bio, timezone, language (as requested: do not use local storage)
  const [dummyBio, setDummyBio] = useState(
    'I manage all system operations, school onboarding, and platform administration.'
  );
  const [dummyTimezone, setDummyTimezone] = useState(
    '(GMT+05:30) Asia/Kolkata'
  );
  const [dummyLanguage, setDummyLanguage] = useState('English');

  // Edit Profile Form state backups for Dialog input fields
  const [dialogBio, setDialogBio] = useState('');
  const [dialogTimezone, setDialogTimezone] = useState('');
  const [dialogLanguage, setDialogLanguage] = useState('');

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <COMMON.LOADER className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  const initials =
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
    'U';

  // Dynamic Profile Completion
  const completionItems = [
    {
      label: 'Basic Information',
      completed: !!user.first_name && !!user.last_name,
    },
    { label: 'Profile Photo', completed: !!user.avatar_url },
    { label: 'Contact Details', completed: !!user.phone },
    { label: 'Security Setup', completed: true },
    {
      label: 'Preferences Details',
      completed: !!dummyBio && !!dummyTimezone && !!dummyLanguage,
    },
  ];
  const completedCount = completionItems.filter(
    (item) => item.completed
  ).length;
  const completionPercentage = Math.round(
    (completedCount / completionItems.length) * 100
  );

  const metrics = getMetrics(user);

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

  // Open Edit Profile Dialog with current state
  const handleOpenEditProfile = () => {
    setEditFirstName(user.first_name || '');
    setEditLastName(user.last_name || '');
    setEditPhone(user.phone || '');
    setDialogBio(dummyBio);
    setDialogTimezone(dummyTimezone);
    setDialogLanguage(dummyLanguage);
    setIsEditProfileOpen(true);
  };

  // Submit Profile Edits
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim()) {
      toast.error('First and Last names are required');
      return;
    }

    try {
      await updateProfile({
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
        phone: editPhone.trim() || null,
      }).unwrap();

      // Save dummy fields to local state
      setDummyBio(dialogBio);
      setDummyTimezone(dialogTimezone);
      setDummyLanguage(dialogLanguage);

      setIsEditProfileOpen(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update profile');
    }
  };

  // Open Change Password Dialog
  const handleOpenChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangePasswordOpen(true);
  };

  // Submit Password Change
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();
      setIsChangePasswordOpen(false);
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update password');
    }
  };

  // Navigation tabs helper
  const tabsList = [
    { id: 'profile', label: 'Profile', icon: COMMON.USER },
    { id: 'security', label: 'Security', icon: COMMON.SHIELD },
    { id: 'notifications', label: 'Notifications', icon: COMMON.BELL },
    { id: 'activity', label: 'Activity Logs', icon: COMMON.CLOCK },
    { id: 'preferences', label: 'Preferences', icon: COMMON.SETTINGS },
  ];

  const breadcrumbRoleLabel =
    user.role_name === 'super_admin'
      ? 'Super Admin'
      : user.role_name === 'school_admin'
        ? 'School Admin'
        : 'Staff';

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
                : '/school/dashboard',
          },
          { label: 'Profile Settings' },
        ]}
      />

      {/* ── Hero Profile Header Card ────────────────────────── */}
      <div className="border-border bg-card relative overflow-hidden rounded-2xl border shadow-sm">
        {/* Colorful Gradient Header Background Accent */}
        <div className="from-primary/15 absolute top-0 left-0 h-32 w-full border-b bg-linear-to-r via-indigo-500/5 to-purple-500/15" />

        <div className="relative flex flex-col gap-6 px-6 pt-16 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            {/* Avatar block with camera upload button */}
            <div className="group relative">
              <Avatar className="border-background size-24 border-4 shadow-md sm:size-28">
                <AvatarImage
                  src={user.avatar_url || undefined}
                  alt={userFullName}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

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
                  <COMMON.LOADER className="size-4 animate-spin" />
                ) : (
                  <COMMON.CAMERA className="size-4" />
                )}
              </button>
            </div>

            {/* Profile Identity info */}
            <div className="flex flex-col leading-tight sm:mb-2">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-foreground text-2xl font-bold tracking-tight">
                  {userFullName}
                </h2>
                <Badge className="border-none bg-green-500/10 text-green-600 capitalize shadow-none">
                  Active
                </Badge>
              </div>
              <span className="text-muted-foreground mt-1 flex items-center justify-center gap-1.5 text-sm sm:justify-start">
                <COMMON.SHIELD className="text-primary size-4" />
                {ROLE_LABELS[user.role_name] || user.role_name}
              </span>

              {/* Status details metadata row */}
              <div className="text-muted-foreground mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs sm:justify-start">
                <span className="flex items-center gap-1">
                  <COMMON.CLOCK className="size-3.5" />
                  Last Login: Today, 09:12 AM
                </span>
                <span className="flex items-center gap-1">
                  <COMMON.CALENDAR className="size-3.5" />
                  Joined: 08 Jun 2026
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit Profile & Password Actions */}
          <div className="flex w-full flex-row gap-3 sm:mb-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={handleOpenEditProfile}
              className="flex-1 cursor-pointer gap-2 rounded-xl text-xs sm:flex-initial sm:text-sm"
            >
              <COMMON.USER className="size-4" />
              Edit Profile
            </Button>
            <Button
              onClick={handleOpenChangePassword}
              className="bg-primary text-primary-foreground hover:bg-primary/95 flex-1 cursor-pointer gap-2 rounded-xl text-xs sm:flex-initial sm:text-sm"
            >
              <COMMON.LOCK className="size-4" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* ── Desktop & Mobile Dynamic Metrics Row ───────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className={`border-border bg-card border border-l-4 ${metric.color}`}
          >
            <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
              <div className="bg-background flex size-9 shrink-0 items-center justify-center rounded-xl text-inherit shadow-xs">
                <metric.icon className="size-4.5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-muted-foreground truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                  {metric.label}
                </span>
                <span className="text-foreground mt-0.5 text-xl leading-none font-bold sm:text-2xl">
                  {metric.value}
                </span>
                <span className="text-muted-foreground mt-1 truncate text-[9px] sm:text-[10px]">
                  {metric.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
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
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.completed ? (
                    <COMMON.CHECK className="size-4 font-bold text-emerald-500" />
                  ) : (
                    <span className="size-2 rounded-full bg-amber-400" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Desktop tab buttons list */}
          <Card className="border-border bg-card hidden border lg:block">
            <div className="flex flex-col space-y-0.5 p-1.5">
              {tabsList.map((tab) => (
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

          {/* Quick Actions Panel */}
          <Card className="border-border bg-card hidden border lg:block">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <div className="flex flex-col space-y-1 px-2 pb-3">
              <button
                onClick={handleOpenChangePassword}
                className="hover:bg-muted/50 text-foreground flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold"
              >
                Change Password
                <COMMON.CHEVRON_RIGHT className="text-muted-foreground size-3.5" />
              </button>
              <button className="hover:bg-muted/50 text-foreground flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold">
                Export My Data
                <COMMON.CHEVRON_RIGHT className="text-muted-foreground size-3.5" />
              </button>
              <button className="hover:bg-muted/50 text-foreground flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold">
                Download Profile PDF
                <COMMON.CHEVRON_RIGHT className="text-muted-foreground size-3.5" />
              </button>
              <button className="hover:bg-destructive/10 text-destructive flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold">
                Logout All Devices
                <COMMON.CHEVRON_RIGHT className="size-3.5" />
              </button>
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
                  {tabsList.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMobileActiveSubView(tab.id)}
                      className="text-foreground/80 hover:bg-muted/30 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-sm font-semibold"
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className="text-primary size-4.5" />
                        {tab.label}
                      </div>
                      <COMMON.CHEVRON_RIGHT className="text-muted-foreground size-4" />
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
                    onClick={handleOpenChangePassword}
                    className="text-foreground/80 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-xs font-semibold"
                  >
                    Change Password
                    <COMMON.CHEVRON_RIGHT className="text-muted-foreground size-4" />
                  </button>
                  <button className="text-foreground/80 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-xs font-semibold">
                    Export My Data
                    <COMMON.CHEVRON_RIGHT className="text-muted-foreground size-4" />
                  </button>
                  <button className="text-foreground/80 flex w-full cursor-pointer items-center justify-between px-2 py-3 text-xs font-semibold">
                    Logout All Devices
                    <COMMON.CHEVRON_RIGHT className="text-destructive size-4" />
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
                <COMMON.X className="size-4" />
                Back to Settings
              </Button>
              {renderTabContent(mobileActiveSubView)}
            </div>
          )}

          {/* Desktop tabbed panel view container */}
          <div className="hidden lg:block">{renderTabContent(activeTab)}</div>
        </div>

        {/* 3. RIGHT SIDEBAR: ACCOUNT SECURITY & RECENT ACTIVITIES (Span 3) */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Account Security details card */}
          <Card className="border-border bg-card border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">
                  Account Security
                </CardTitle>
                <Badge className="border-none bg-emerald-500/10 text-emerald-600 shadow-none">
                  Strong
                </Badge>
              </div>
            </CardHeader>
            <div className="flex flex-col space-y-3.5 px-5 pb-4 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold">
                    Password
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[10px]">
                    Updated 5 days ago
                  </span>
                </div>
                <COMMON.CHECK className="mt-0.5 size-4 text-emerald-500" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold">
                    Two-Factor Auth
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[10px]">
                    Enabled via App
                  </span>
                </div>
                <COMMON.CHECK className="mt-0.5 size-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground">Active Sessions</span>
                <button className="text-primary font-semibold hover:underline">
                  3 sessions
                </button>
              </div>
            </div>
          </Card>

          {/* Recent activity timeline */}
          <Card className="border-border bg-card border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">
                  Recent Activity
                </CardTitle>
                <button className="text-primary text-xs font-semibold hover:underline">
                  View All
                </button>
              </div>
            </CardHeader>
            <div className="flex flex-col space-y-4 px-5 pb-5">
              <div className="flex gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <COMMON.USER className="size-3.5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-foreground font-semibold">
                    Profile updated
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[10px]">
                    Today, 09:12 AM
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <COMMON.LOCK className="size-3.5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-foreground font-semibold">
                    Password changed
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[10px]">
                    07 Jun 2026, 04:35 PM
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <COMMON.SHIELD_CHECK className="size-3.5" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-foreground font-semibold">
                    Logged in successfully
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[10px]">
                    07 Jun 2026, 09:15 AM
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Edit Profile Modal Dialog ────────────────────────── */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <DialogDescription>
              Update your account details. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-xs font-semibold">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-xs font-semibold">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+91 XXXXX XXXXX"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="rounded-lg text-xs"
              />
            </div>

            {/* Dummy fields editing triggers */}
            <div className="space-y-1">
              <Label htmlFor="bio" className="text-xs font-semibold">
                About / Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={dialogBio}
                onChange={(e) => setDialogBio(e.target.value)}
                className="min-h-16 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs font-semibold">
                  Time Zone
                </Label>
                <Select
                  value={dialogTimezone}
                  onValueChange={setDialogTimezone}
                >
                  <SelectTrigger id="timezone" className="w-full text-xs">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="(GMT+05:30) Asia/Kolkata">
                      (GMT+05:30) Kolkata
                    </SelectItem>
                    <SelectItem value="(GMT+00:00) UTC">
                      (GMT+00:00) UTC
                    </SelectItem>
                    <SelectItem value="(GMT-05:00) EST">
                      (GMT-05:00) EST
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-xs font-semibold">
                  Language
                </Label>
                <Select
                  value={dialogLanguage}
                  onValueChange={setDialogLanguage}
                >
                  <SelectTrigger id="language" className="w-full text-xs">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer rounded-xl text-xs sm:text-sm"
              >
                {isUpdatingProfile && (
                  <COMMON.LOADER className="mr-2 size-3 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Change Password Modal Dialog ──────────────────────── */}
      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Account Password</DialogTitle>
            <DialogDescription>
              Provide your current password to authorize this action.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePassword} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="currentPass" className="text-xs font-semibold">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPass"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-lg pr-10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="text-muted-foreground/60 hover:text-foreground absolute inset-y-0 right-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <COMMON.EYE_OFF className="size-4" />
                  ) : (
                    <COMMON.EYE className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPass" className="text-xs font-semibold">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPass"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-lg pr-10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-muted-foreground/60 hover:text-foreground absolute inset-y-0 right-3 flex items-center"
                >
                  {showNewPassword ? (
                    <COMMON.EYE_OFF className="size-4" />
                  ) : (
                    <COMMON.EYE className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPass" className="text-xs font-semibold">
                Confirm New Password
              </Label>
              <Input
                id="confirmPass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-lg text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer rounded-xl text-xs sm:text-sm"
              >
                {isChangingPassword && (
                  <COMMON.LOADER className="mr-2 size-3 animate-spin" />
                )}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Tab switcher view renderer
  function renderTabContent(tabId) {
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
                  onClick={handleOpenEditProfile}
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
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-foreground text-sm font-medium break-all">
                        {user.email}
                      </span>
                      <Badge className="border-none bg-emerald-500/10 px-1 py-0 text-[8px] text-emerald-600 shadow-none">
                        Verified
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-semibold">
                      Phone Number
                    </span>
                    <span className="text-foreground mt-1 text-sm font-medium">
                      {user.phone || 'Not configured'}
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
                      {user.department_name || 'Administration'}
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-semibold">
                      Time Zone
                    </span>
                    <span className="text-foreground mt-1 text-sm font-medium">
                      {dummyTimezone}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-semibold">
                      Language
                    </span>
                    <span className="text-foreground mt-1 text-sm font-medium">
                      {dummyLanguage}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About / Bio Panel */}
            <Card className="border-border bg-card border">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-bold">
                  About / Bio
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenEditProfile}
                  className="cursor-pointer gap-1.5 text-xs"
                >
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-foreground text-xs leading-relaxed">
                  {dummyBio}
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
                  onClick={handleOpenChangePassword}
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
                <Badge className="border-none bg-emerald-500/10 text-xs text-emerald-600 shadow-none">
                  Enabled
                </Badge>
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                  Active Device Sessions
                </h4>
                <div className="space-y-2.5">
                  <div className="bg-muted/10 flex items-center justify-between rounded-xl border p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                        <COMMON.USER className="size-4.5" />
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="text-foreground font-semibold">
                          Windows Chrome (Current Session)
                        </span>
                        <span className="text-muted-foreground mt-0.5 text-[10px]">
                          IP: 103.54.21.90 · active now
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/10 flex items-center justify-between rounded-xl border p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-lg">
                        <COMMON.PHONE className="size-4.5" />
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="text-foreground font-semibold">
                          iPhone 14 Mobile App
                        </span>
                        <span className="text-muted-foreground mt-0.5 text-[10px]">
                          IP: 182.12.33.109 · last active 2 hours ago
                        </span>
                      </div>
                    </div>
                  </div>
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
              <div className="relative space-y-5 border-l py-2.5 pl-6">
                <div className="relative">
                  <span className="ring-background absolute top-0.5 -left-8.5 flex size-5 items-center justify-center rounded-full bg-blue-500 text-white ring-4">
                    <COMMON.CHECK className="size-3" />
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="text-foreground font-semibold">
                      Profile updated
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-[10px]">
                      Today, 09:12 AM
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <span className="ring-background absolute top-0.5 -left-8.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white ring-4">
                    <COMMON.LOCK className="size-3" />
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="text-foreground font-semibold">
                      Password updated
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-[10px]">
                      07 Jun 2026, 04:35 PM
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <span className="ring-background absolute top-0.5 -left-8.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-4">
                    <COMMON.CHECK className="size-3" />
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="text-foreground font-semibold">
                      New device login detected (IP: 103.54.21.90)
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-[10px]">
                      07 Jun 2026, 09:15 AM
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <span className="ring-background absolute top-0.5 -left-8.5 flex size-5 items-center justify-center rounded-full bg-purple-500 text-white ring-4">
                    <COMMON.CHECK className="size-3" />
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="text-foreground font-semibold">
                      Profile photo uploaded
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-[10px]">
                      06 Jun 2026, 11:20 AM
                    </span>
                  </div>
                </div>
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
                <Select value={dummyTimezone} onValueChange={setDummyTimezone}>
                  <SelectTrigger
                    id="defaultTimezone"
                    className="w-full text-xs"
                  >
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="(GMT+05:30) Asia/Kolkata">
                      (GMT+05:30) Kolkata
                    </SelectItem>
                    <SelectItem value="(GMT+00:00) UTC">
                      (GMT+00:00) UTC
                    </SelectItem>
                    <SelectItem value="(GMT-05:00) EST">
                      (GMT-05:00) EST
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label htmlFor="defaultLanguage" className="font-semibold">
                  Language Preference
                </Label>
                <Select value={dummyLanguage} onValueChange={setDummyLanguage}>
                  <SelectTrigger
                    id="defaultLanguage"
                    className="w-full text-xs"
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  }
};

export default ProfileView;
