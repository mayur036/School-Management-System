/**
 * @file base.icons.jsx
 * @description Universal icon primitives shared across all roles and features.
 * Import from this file when an icon is not role-specific.
 */

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BellOff,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Edit2,
  Eye,
  EyeOff,
  FileQuestion,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Home,
  Info,
  LayoutGrid,
  LifeBuoy,
  List,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Send,
  ServerCrash,
  Settings,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Trash2,
  Upload,
  User,
  UserCheck,
  UserRoundPlus,
  Users,
  Wrench,
  X,
  XCircle,
  ZoomIn,
} from 'lucide-react';

/** Universal icons shared across all roles and feature areas. */
export const BASE = {
  // Navigation
  HOME: Home,
  ARROW_LEFT: ArrowLeft,
  ARROW_RIGHT: ArrowRight,
  CHEVRON_LEFT: ChevronLeft,
  CHEVRON_RIGHT: ChevronRight,
  CHEVRON_UP: ChevronUp,
  CHEVRON_DOWN: ChevronDown,
  CHEVRON_SORT: ChevronsUpDown,
  MENU: Menu,

  // Actions
  PLUS: Plus,
  EDIT: Edit2,
  SAVE: Save,
  TRASH: Trash2,
  COPY: Copy,
  SEND: Send,
  SEARCH: Search,
  FILTER: Filter,
  REFRESH: RefreshCw,
  ROTATE_CCW: RotateCcw,
  UPLOAD: Upload,
  DOWNLOAD: Download,
  ZOOM_IN: ZoomIn,

  // State / Status
  CHECK: Check,
  CHECK_CIRCLE: CheckCircle2,
  X: X,
  X_CIRCLE: XCircle,
  LOADER: Loader2,
  ACTIVITY: Activity,
  POWER: Power,

  // Feedback
  INFO: Info,
  ALERT: AlertCircle,
  SHIELD: Shield,
  SHIELD_ALERT: ShieldAlert,
  SHIELD_CHECK: ShieldCheck,

  // UI Controls
  MORE_H: MoreHorizontal,
  MORE_V: MoreVertical,
  GRID_VIEW: LayoutGrid,
  LIST_VIEW: List,
  EYE: Eye,
  EYE_OFF: EyeOff,

  // Comms / Identity
  BELL: Bell,
  BELL_OFF: BellOff,
  MAIL: Mail,
  PHONE: Phone,
  CAMERA: Camera,
  GLOBE: Globe,

  // Date / Time
  CALENDAR: Calendar,
  CLOCK: Clock,

  // Auth / Security
  LOCK: Lock,
  LOGIN: LogIn,
  LOGOUT: LogOut,

  // Files
  FILE_TEXT: FileText,
  FILE_QUESTION: FileQuestion,

  // Settings / Support
  SETTINGS: Settings,
  SETTINGS_2: Settings2,
  WRENCH: Wrench,
  LIFE_BUOY: LifeBuoy,
  SERVER_CRASH: ServerCrash,

  // Theme
  SUN: Sun,
  MOON: Moon,

  // People (generic)
  USER: User,
  USERS: Users,
  USER_CHECK: UserCheck,
  USER_PLUS: UserRoundPlus,

  // Brand / Org
  GRADUATION_CAP: GraduationCap,
  BUILDING: Building2,
};

export default BASE;
