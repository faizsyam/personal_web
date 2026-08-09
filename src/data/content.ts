import hero from './sections/hero.json';
import intro from './sections/intro.json';
import sections from './sections/sections.json';
import projects from './sections/projects.json';
import background from './sections/background.json';
import writings from './sections/writings.json';
import venn from './sections/venn.json';
import slides from './sections/intro-article.json';
import contact from './sections/contact.json';
import ui from './sections/ui.json';

import type { Project, Writing, BackgroundItem } from '../types';

export const HERO = hero;
export const INTRO = intro;
export const SECTION_LABELS = sections;
export const VENN = venn;
export const INTRO_SLIDES = slides;
export const CONTACT = contact;
export const UI = ui;

function asProjectList(data: any[]): Project[] {
  return data as Project[];
}

function asWritingList(data: any[]): Writing[] {
  return data as Writing[];
}

function asBackground(data: any): { columns: any[]; credentials: BackgroundItem[] } {
  return data as { columns: any[]; credentials: BackgroundItem[] };
}

export const PROJECTS = asProjectList(projects);
export const WRITINGS = asWritingList(writings);
export const BACKGROUND = asBackground(background);

// Backward compatibility exports - move to use BACKGROUND.columns
export const WORK_ITEMS = BACKGROUND.columns.find(c => c.id === 'work')?.items ?? [];
export const EDUCATION_ITEMS = BACKGROUND.columns.find(c => c.id === 'education')?.items ?? [];