import { Component } from '@angular/core';

interface ExperienceItem {
  period: string;
  role: string;
  summary: string;
}

const EXPERIENCE: readonly ExperienceItem[] = [
  {
    period: '2022 — PRESENT',
    role: 'Senior Frontend Engineer · Northwind Labs',
    summary: 'Lead the design-systems team; owns the component library powering six products.',
  },
  {
    period: '2019 — 2022',
    role: 'Frontend Engineer · Meridian',
    summary: 'Built the customer dashboard and shipped a full accessibility overhaul.',
  },
  {
    period: '2016 — 2019',
    role: 'UI Developer · Studio Foundry',
    summary: 'Marketing sites and interactive campaigns for a range of clients.',
  },
];

const SKILLS: readonly string[] = [
  'TYPESCRIPT',
  'DESIGN SYSTEMS',
  'REACT',
  'MOTION',
  'A11Y',
  'CSS',
  'WEBGL',
  'PERFORMANCE',
  'TYPE DESIGN',
  'KEYBOARDS',
];

@Component({
  selector: 'page-about',
  templateUrl: './about.html',
  styleUrl: './about.less',
})
export class About {
  protected readonly experience = EXPERIENCE;
  protected readonly skills = SKILLS;
}
