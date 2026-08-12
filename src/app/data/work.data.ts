import { WorkItem } from '../core/models';

export const WORK_ITEMS: readonly WorkItem[] = [
  {
    slug: 'sample-project-one',
    title: 'Sample Project One',
    role: 'Frontend Engineer',
    year: 2025,
    summary: 'A short summary of what this project was and the impact it had.',
    tags: ['angular', 'typescript'],
  },
  {
    slug: 'sample-project-two',
    title: 'Sample Project Two',
    role: 'Full-stack Engineer',
    year: 2024,
    summary: 'Another short summary describing scope, role, and outcome.',
    tags: ['node', 'postgres'],
  },
];
