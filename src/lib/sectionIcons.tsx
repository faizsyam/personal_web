import {
  Briefcase,
  Brain,
  Gamepad2,
  Terminal,
  GraduationCap,
  BookOpen,
  Trophy,
  Award,
  Globe,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type IconKey =
  | 'work-1'
  | 'work-2'
  | 'work-3'
  | 'work-4'
  | 'edu-1'
  | 'edu-2'
  | 'cred-0'
  | 'cred-1'
  | 'cred-2';

const ICON_MAP: Record<IconKey, LucideIcon> = {
  'work-1': Briefcase,
  'work-2': Brain,
  'work-3': Gamepad2,
  'work-4': Terminal,
  'edu-1': GraduationCap,
  'edu-2': BookOpen,
  'cred-0': Trophy,
  'cred-1': Award,
  'cred-2': Globe,
};

export function lookupIcon(key: IconKey, isLatest?: boolean) {
  const Icon = ICON_MAP[key];
  if (!Icon) return null;

  return (
    <Icon
      className={
        isLatest
          ? "w-4 h-4 text-highlight transition-colors duration-200 group-hover:text-[#F5F3EE]"
          : "w-4 h-4 text-highlight opacity-70 dark:opacity-80 group-hover:opacity-100 transition-all duration-200"
      }
      strokeWidth={1.5}
    />
  );
}