/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PersonalInfo {
  name: string;
  title: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  summary: string;
  photoUrl?: string;
  showPhoto?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface PortfolioLinkItem {
  id: string;
  platform: 'linkedin' | 'github' | 'facebook' | 'telegram' | 'website' | 'other';
  label: string;
  url: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  portfolioLinks: PortfolioLinkItem[];
}

export type ThemeId = 'clean_minimalism' | 'classic_navy' | 'digital_emerald' | 'minimal_slate' | 'editorial_burgundy' | 'warm_amber';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  primaryColor: string;
  accentColor: string;
  fontSans: string;
  fontSerif: string;
  bgClass: string;
  accentText: string;
  borderClass: string;
}
