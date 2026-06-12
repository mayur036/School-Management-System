import { Calendar, Mail, Phone, School, User, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import {
  formatDate,
  formatPhoneNumber,
  formatStaffId,
  getInitials,
} from '@/lib/utils';

const StaffDetailDrawer = ({ member, open, onClose }) => {
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="mx-auto max-w-xl overflow-visible pb-4 sm:pb-6">
        <div className="relative w-full overflow-hidden sm:max-h-[85vh] sm:overflow-y-auto">
          {/* Top Right Close Button */}
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-muted/60 hover:bg-muted text-muted-foreground absolute top-4 right-4 z-50 size-8 cursor-pointer rounded-full sm:top-5 sm:right-5"
              aria-label="Close details"
            >
              <X className="size-4" />
            </Button>
          </DrawerClose>

          {/* Drawer Header Title & Subtitle */}
          <DrawerHeader className="px-4 pt-4 pb-1 text-left! sm:px-6 sm:pt-6 sm:pb-2">
            <DrawerTitle className="text-xl font-bold tracking-tight sm:text-2xl">
              Staff Profile
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-xs sm:text-sm">
              Detailed information for this staff member account.
            </DrawerDescription>
          </DrawerHeader>

          {member && (
            <div className="flex flex-col gap-4 px-4 py-2 sm:gap-6 sm:px-6 sm:py-4">
              {/* Profile Card Header: Avatar + Quick Info */}
              <div className="flex flex-row items-start gap-3 text-left sm:gap-5">
                {/* Avatar with status indicator dot */}
                <div className="relative shrink-0">
                  <Avatar className="border-card size-14 border-4 shadow-md sm:size-20">
                    <AvatarImage
                      src={member.avatar_url}
                      alt={`${member.first_name} ${member.last_name}`}
                    />
                    <AvatarFallback className="bg-emerald-100 text-sm font-bold text-emerald-800 sm:text-xl">
                      {getInitials(member) || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`border-card absolute right-0 bottom-0 size-3.5 rounded-full border-2 sm:size-4.5 sm:border-3 ${
                      member.status === 'active'
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>

                {/* Quick Info text details */}
                <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                  <h3 className="text-foreground text-lg font-bold tracking-tight sm:text-2xl">
                    {member.first_name} {member.last_name}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <Badge className="flex items-center gap-1 rounded-full border-none bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 hover:bg-purple-100 sm:gap-1.5 sm:text-xs dark:bg-purple-950/40 dark:text-purple-300">
                      <School className="size-3 text-purple-700 sm:size-3.5 dark:text-purple-300" />
                      {member.department_name || 'Unassigned'}
                    </Badge>
                    <Badge
                      className={`flex items-center gap-1 rounded-full border-none px-2 py-0.5 text-[10px] font-semibold sm:gap-1.5 sm:text-xs ${
                        member.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      <span
                        className={`size-1 rounded-full sm:size-1.5 ${
                          member.status === 'active'
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 font-mono text-[10px] sm:text-xs">
                    Staff ID: {formatStaffId(member.staff_id)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Account Details list */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <h4 className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase sm:text-xs">
                  Account Details
                </h4>

                <div className="flex flex-col gap-1.5 sm:gap-2.5">
                  {/* First Name */}
                  <div className="bg-card border-border/50 hover:border-border flex w-full items-center rounded-xl border p-2 shadow-xs transition-colors sm:p-3.5">
                    <div className="grid w-full grid-cols-[100px_1fr] items-center gap-2 text-xs sm:grid-cols-[170px_1fr] sm:gap-4 sm:text-sm">
                      <div className="text-muted-foreground/80 flex items-center gap-2 font-normal sm:gap-3">
                        <User className="size-3.5 shrink-0 text-indigo-500 sm:size-4" />
                        <span>First Name</span>
                      </div>
                      <span className="text-foreground truncate font-medium">
                        {member.first_name}
                      </span>
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="bg-card border-border/50 hover:border-border flex w-full items-center rounded-xl border p-2 shadow-xs transition-colors sm:p-3.5">
                    <div className="grid w-full grid-cols-[100px_1fr] items-center gap-2 text-xs sm:grid-cols-[170px_1fr] sm:gap-4 sm:text-sm">
                      <div className="text-muted-foreground/80 flex items-center gap-2 font-normal sm:gap-3">
                        <User className="size-3.5 shrink-0 text-indigo-500 sm:size-4" />
                        <span>Last Name</span>
                      </div>
                      <span className="text-foreground truncate font-medium">
                        {member.last_name}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-card border-border/50 hover:border-border flex w-full items-center rounded-xl border p-2 shadow-xs transition-colors sm:p-3.5">
                    <div className="grid w-full grid-cols-[100px_1fr] items-center gap-2 text-xs sm:grid-cols-[170px_1fr] sm:gap-4 sm:text-sm">
                      <div className="text-muted-foreground/80 flex items-center gap-2 font-normal sm:gap-3">
                        <Mail className="size-3.5 shrink-0 text-indigo-500 sm:size-4" />
                        <span>Email</span>
                      </div>
                      <span className="text-foreground truncate font-mono font-medium">
                        {member.email}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-card border-border/50 hover:border-border flex w-full items-center rounded-xl border p-2 shadow-xs transition-colors sm:p-3.5">
                    <div className="grid w-full grid-cols-[100px_1fr] items-center gap-2 text-xs sm:grid-cols-[170px_1fr] sm:gap-4 sm:text-sm">
                      <div className="text-muted-foreground/80 flex items-center gap-2 font-normal sm:gap-3">
                        <Phone className="size-3.5 shrink-0 text-indigo-500 sm:size-4" />
                        <span>Phone</span>
                      </div>
                      <span className="text-foreground truncate font-medium">
                        {member.phone ? formatPhoneNumber(member.phone) : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Registered */}
                  <div className="bg-card border-border/50 hover:border-border flex w-full items-center rounded-xl border p-2 shadow-xs transition-colors sm:p-3.5">
                    <div className="grid w-full grid-cols-[100px_1fr] items-center gap-2 text-xs sm:grid-cols-[170px_1fr] sm:gap-4 sm:text-sm">
                      <div className="text-muted-foreground/80 flex items-center gap-2 font-normal sm:gap-3">
                        <Calendar className="size-3.5 shrink-0 text-indigo-500 sm:size-4" />
                        <span>Registered</span>
                      </div>
                      <span className="text-foreground truncate font-medium">
                        {formatDate(member.created_at, 'medium-time')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StaffDetailDrawer;
