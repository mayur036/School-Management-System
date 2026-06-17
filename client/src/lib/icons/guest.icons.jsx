/**
 * @file guest.icons.jsx
 * @description Icons used across the public/marketing pages (Home, About,
 * Features, Contact) and the public navbar/footer. Keep all guest-facing icon
 * usage routed through this dictionary — never import lucide-react directly.
 */

import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

export const GUEST = {
  // Brand / nav
  LOGO: GraduationCap,
  BUILDING: Building2,
  MENU: Menu,
  CLOSE: X,
  ARROW_RIGHT: ArrowRight,
  SPARKLES: Sparkles,

  // Auth / security
  LOGIN: User,
  SECURITY: ShieldCheck,
  LOCK: Lock,

  // Feature highlights
  DASHBOARD: LayoutDashboard,
  USERS: Users,
  USER_CHECK: UserCheck,
  SCHEDULE: CalendarClock,
  TASKS: ClipboardList,
  ATTENDANCE: Clock,
  CHECK: CheckCircle2,

  // State
  LOADER: Loader2,

  // Contact
  MAIL: Mail,
  PHONE: Phone,
  MAP_PIN: MapPin,
  SEND: Send,
};

export default GUEST;
