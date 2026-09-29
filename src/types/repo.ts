/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RepoConfig {
  repoName: string;
  ownerName: string;
  tagline: string;
  description: string;
  version: string;
  licenseType: 'Apache-2.0' | 'MIT' | 'GPL-3.0' | 'BSD-3-Clause';
  authorName: string;
  authorEmail: string;
  year: string;
  primaryLanguage: 'Python' | 'TypeScript / Node' | 'Hybrid';
  wakeWord: string;
  latencyGoal: string;
  features: string[];
  topics: string[];
}

export interface LicenseInfo {
  id: string;
  name: string;
  badgeUrl: string;
  summary: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  whyRecommendedForAura: string;
  fullTextTemplate: (author: string, year: string, repoName: string) => string;
}

export interface ScaffoldingFile {
  filename: string;
  path: string;
  description: string;
  content: string;
  language: string;
}
