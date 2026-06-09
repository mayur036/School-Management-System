import {
  Atom,
  Binary,
  BookOpen,
  Building2,
  Dumbbell,
  Globe,
  Heart,
  Lightbulb,
  Palette,
} from 'lucide-react';

export const DEPARTMENT_DESCRIPTIONS = {
  arts: 'Visual arts, performing arts, and design studies',
  humanities: 'History, geography, civics, and social studies',
  languages: 'English, regional & foreign languages',
  mathematics: 'Mathematics and applied mathematics',
  science: 'Physics, chemistry, biology, computer science',
  physical: 'Sports, fitness, and wellness education',
  research: 'Innovation cell, research & development',
  student: 'Counseling, mentoring & student support',
  default: 'Academic or administrative department operations',
};

export const DEPARTMENT_GRADIENTS = {
  arts: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200/30',
  humanities:
    'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200/30',
  languages:
    'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200/30',
  mathematics:
    'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200/30',
  science:
    'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200/30',
  physical:
    'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-200/30',
  research:
    'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200/30',
  student:
    'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 border border-pink-200/30',
  default:
    'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-200/30',
};

export const DEPARTMENT_ICONS = {
  arts: Palette,
  humanities: Globe,
  languages: BookOpen,
  mathematics: Binary,
  science: Atom,
  physical: Dumbbell,
  research: Lightbulb,
  student: Heart,
  default: Building2,
};
