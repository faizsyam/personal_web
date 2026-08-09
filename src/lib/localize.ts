export type Lang = 'en' | 'id';

export interface LocStr { en: string; id: string; }
export interface LocArr  { en: string[]; id: string[]; }

export type Loc<T = string> =
  | T
  | { en: T; id: T };

export function localize<T>(v: Loc<T>, lang: Lang): T {
  return v && typeof v === 'object' && 'en' in v ? (v as { en: T; id: T })[lang] : (v as T);
}