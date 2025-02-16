/**
 * Generated from https://zed.dev/schema/icon_themes/v0.2.0.json
 */

export type AppearanceContent = "light" | "dark";

export interface IconThemeFamilyContent {
  author: string;
  name: string;
  themes: IconThemeContent[];
  [k: string]: unknown;
}

export interface IconThemeContent {
  appearance: AppearanceContent;
  chevron_icons?: ChevronIconsContent;
  directory_icons?: DirectoryIconsContent;
  file_icons?: {
    [k: string]: IconDefinitionContent;
  };
  file_stems?: {
    [k: string]: string;
  };
  file_suffixes?: {
    [k: string]: string;
  };
  name: string;
  [k: string]: unknown;
}

export interface ChevronIconsContent {
  collapsed?: string | null;
  expanded?: string | null;
  [k: string]: unknown;
}

export interface DirectoryIconsContent {
  collapsed?: string | null;
  expanded?: string | null;
  [k: string]: unknown;
}

export interface IconDefinitionContent {
  path: string;
  [k: string]: unknown;
}
