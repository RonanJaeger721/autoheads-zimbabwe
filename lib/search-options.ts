import {
  sourceMechanicCategories,
  sourceWorkshopCategories,
} from '@/lib/source-directory-data';
import { categories as sparesCategories } from '@/lib/autoheads-data';

export const cityAreas: Record<string, string[]> = {
  Harare: [
    'All areas',
    'Avondale',
    'Borrowdale',
    'CBD',
    'Eastlea',
    'Graniteside',
    'Highlands',
    'Kopje',
    'Milton Park',
    'Msasa',
    'Southerton',
  ],
  Bulawayo: [
    'All areas',
    'CBD',
    'Belmont',
    'Donnington',
    'Famona',
    'Thorngrove',
  ],
  Gweru: ['All areas', 'CBD', 'Light Industrial Area'],
  Mutare: ['All areas', 'CBD', 'Industrial Area'],
  Masvingo: ['All areas', 'CBD', 'Industrial Area'],
  Chitungwiza: ['All areas', 'Makoni', 'Seke', 'Zengeza'],
  Kwekwe: ['All areas', 'CBD', 'Industrial Area'],
  Kadoma: ['All areas', 'CBD', 'Industrial Area'],
  Marondera: ['All areas', 'CBD', 'Industrial Area'],
};

export const helpCategories = Array.from(
  new Set([
    ...sourceMechanicCategories,
    ...sourceWorkshopCategories,
    ...sparesCategories,
    'Towing',
  ]),
).sort((a, b) => a.localeCompare(b));

export const providerTypes = [
  'Mechanic',
  'Workshop',
  'Spares',
  'Towing',
  'Other',
] as const;
