/**
 * Types representing the elements on Faiz's portfolio.
 */

export type Lang = 'en' | 'id';

export interface LocStr { en: string; id: string; }
export interface LocArr  { en: string[]; id: string[]; }

export type Loc<T = string> =
  | T
  | { en: T; id: T };

export function localize<T>(v: Loc<T>, lang: Lang): T {
  return v && typeof v === 'object' && 'en' in v ? (v as { en: T; id: T })[lang] : (v as T);
}

export interface Project {
  id: string;
  name: string;
  subtitle: LocStr;
  domainTags: string[];
  status: 'Active' | 'Completed' | 'Research';
  type: 'Personal' | 'Academic' | 'Professional';
  context: LocStr;
  challenge: LocStr;
  description: LocStr;
  depthTradeoff: LocStr;
  stack: string[];
  link?: string;
  imagePath?: string;
}

export interface Writing {
  id: string;
  title: string;
  framing: LocStr;
  excerpt: LocStr;
  topicTag: LocStr;
  date: string;
  link: string;
  imagePath?: string;
}

export interface BackgroundItem {
  id: string;
  type: 'work' | 'education' | 'credential';
  role: LocStr;
  organization: LocStr;
  dateRange: string;
  popoutCopy: LocStr;
  details?: LocStr;
  highlights?: LocArr;
  skills?: string[];
  logoPath?: string;
  bannerImage?: string;
  iconKey?: string;
}