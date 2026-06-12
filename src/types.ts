/**
 * Types representing the elements on Faiz's portfolio.
 */

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  domainTags: string[];
  status: 'Active' | 'Completed' | 'Research';
  context: string;
  description: string;
  depthTradeoff: string;
  stack: string[];
  link?: string;
  imagePath?: string;
}

export interface Writing {
  id: string;
  title: string;
  framing: string;
  excerpt: string;
  topicTag: string;
  date: string;
  link: string;
  imagePath?: string;
}

export interface BackgroundItem {
  id: string;
  type: 'work' | 'education';
  role: string;
  organization: string;
  dateRange: string;
  popoutCopy: string;
  details?: string;
  highlights?: string[];
  skills?: string[];
  logoPath?: string;
}
