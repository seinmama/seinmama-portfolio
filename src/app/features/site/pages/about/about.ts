import { Component } from '@angular/core';

interface ExperienceItem {
  period: string;
  role: string;
  summary: string;
  highlights?: readonly string[];
  stack?: string;
}

const EXPERIENCE: readonly ExperienceItem[] = [
  {
    period: 'JUL 2023 — PRESENT',
    role: 'Senior Front-End Engineer · Block Aero Technologies',
    summary:
      'A trusted front-end engineer on an enterprise aerospace platform, turning complex, data-heavy dealer workflows into fast, reliable Angular interfaces.',
    highlights: [
      'Raised project test coverage to over 70%, then used AI to build an end-to-end suite in just two weeks that reached 95% coverage',
      'Cleaned up the AG Grid layer, replacing duplicated grid code with shared column utilities and standard editable cells so every new grid starts from a proven base',
      'Designed reusable components and extensible list and bulk-operation building blocks that the whole team uses to ship new screens faster',
      'Made data-heavy views noticeably snappier by optimising rendering and API handling for large datasets',
      'Brought clarity to complex legacy code, restructuring it so teammates can debug and deliver with confidence',
      'The go-to person for production issues: diagnosing quickly and fixing root causes to keep the platform stable for users',
      'A dependable Agile teammate, partnering closely with QA, backend and product, estimating honestly and delivering on time, sprint after sprint',
    ],
    stack:
      'Angular · RxJS · TypeScript · JavaScript (ES6+) · HTML5 · CSS3/LESS · AG Grid · REST APIs · Git · Jira · Figma · Claude AI',
  },
  {
    period: 'JUN 2022 — MAY 2023',
    role: 'Senior Front-End Developer · Design Shared Co., Ltd.',
    summary:
      'A senior voice in a tight five-person team, shipping in-house Angular products that were faster, sturdier and easier to build on.',
    highlights: [
      'Introduced unit testing across the project, giving the team a safety net that cut regressions and made releases calmer',
      'Built a library of reusable, responsive components with Angular Material and SCSS that sped up every new feature',
      'Made the apps feel faster and smoother by tuning performance and tightening REST API integration',
      'Stepped in fast on critical production issues, keeping the system stable with minimal downtime',
      'Worked across Angular v10–v14 with TypeScript and RxJS, keeping the codebase modern as the framework evolved',
      'Kept a fast-paced Agile team in sync, with clear Jira updates on tasks, bugs and sprint progress',
    ],
    stack:
      'Angular (v10–v14) · Angular Material · RxJS · TypeScript · JavaScript (ES6+) · HTML5 · CSS3 · SCSS · Responsive design · RESTful APIs · Git · Jira',
  },
  {
    period: 'AUG 2020 — MAY 2022',
    role: 'Senior Front-End Developer · Bay Archers Pty., Ltd.',
    summary:
      'Took a PTE exam practice platform from a blank page to a live product, working with a five-person team from the first conversation to production.',
    highlights: [
      'Led design and development end to end, from requirement gathering to production launch',
      'Bridged the gap with non-technical stakeholders: learned the PTE exam flow inside out and turned it into clear, buildable specs',
      'Delivered all four exam areas (speaking, listening, reading and writing) as a realistic, responsive exam simulation',
      'Designed the architecture: a scalable Angular front end on Node.js/Express services with MongoDB',
      'Brought in AWS Transcribe for automated speech-to-text evaluation, adding a feature the product could not offer before',
      'Integrated payments, then deployed and ran the platform in the cloud, keeping it stable and always available',
    ],
    stack: 'Angular · Node.js · Express · MongoDB · AWS Transcribe · Payment integration',
  },
  {
    period: 'OCT 2018 — JUL 2020',
    role: 'Front-End Developer · Amdon Consulting Pte., Ltd.',
    summary:
      'Grew into a key contributor on a 12-person team, building a school management system that schools relied on every day.',
    highlights: [
      'Shipped new features and upgraded existing ones across the school management application',
      'Made the system more stable and faster by resolving long-standing issues and tuning performance',
      'Built responsive, cross-browser interfaces backed by REST APIs for dynamic, data-driven features',
      'Mentored junior developers through onboarding and daily work, helping them become productive sooner',
      'Had a voice in sprint planning and technical discussions, helping shape how features were built',
    ],
    stack: 'Angular · TypeScript · RxJS · HTML5 · CSS3/SCSS · REST APIs',
  },
  {
    period: 'OCT 2017 — SEP 2018',
    role: 'Full Stack Developer · ICT Star Group Myanmar',
    summary:
      'Started my career full stack, helping a 10-person team deliver a copper line management system from database to client demo.',
    highlights: [
      'Built business web applications with Java and the Spring Framework',
      'Designed and maintained the SQL databases that ran day-to-day operations',
      'Worked with the business to gather and analyse data requirements before building',
      'Took part in every stage: planning, development, testing and deployment',
      'Presented finished work directly to clients and brought their feedback back to the team',
    ],
    stack: 'Java · Spring Framework · SQL · HTML · CSS · JavaScript',
  },
];

// Drawn from the stacks above, core front-end first.
const SKILLS: readonly string[] = [
  'ANGULAR',
  'TYPESCRIPT',
  'RXJS',
  'JAVASCRIPT',
  'HTML5',
  'CSS3 / SCSS / LESS',
  'ANGULAR MATERIAL',
  'AG GRID',
  'RESPONSIVE DESIGN',
  'REST APIS',
  'UNIT & E2E TESTING',
  'NODE.JS',
  'EXPRESS',
  'MONGODB',
  'JAVA',
  'SPRING',
  'SQL',
  'AWS TRANSCRIBE',
  'GIT',
  'JIRA',
  'FIGMA',
  'CLAUDE AI',
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
