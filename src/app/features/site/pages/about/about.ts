import { Component, signal } from '@angular/core';
import { QUICK_LINKS } from '../../../../data/links.data';
import { CONTACT } from '../../../../data/contact.data';

interface ExperienceItem {
  start: string; // 'YYYY-MM'
  end?: string; // 'YYYY-MM'; omitted for the current role
  role: string;
  company: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
}

interface RoadmapStat {
  value: string;
  label: string;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const VISIBLE_HIGHLIGHTS = 3;

function toMonthIndex(ym: string): number {
  const [year, month] = ym.split('-').map(Number);
  return year * 12 + month - 1;
}

function currentMonthIndex(): number {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

// Inclusive of both the start and end month, e.g. JUN 2022 — MAY 2023 is 1 YR.
function formatDuration(item: ExperienceItem): string {
  const end = item.end ? toMonthIndex(item.end) : currentMonthIndex();
  const total = end - toMonthIndex(item.start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [years && `${years} YR${years > 1 ? 'S' : ''}`, months && `${months} MO`].filter(Boolean);
  return parts.join(' ') || '1 MO';
}

const EXPERIENCE: readonly ExperienceItem[] = [
  {
    start: '2023-07',
    role: 'Senior Front-End Engineer',
    company: 'Block Aero Technologies',
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
    stack: ['Angular', 'RxJS', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3/LESS', 'AG Grid', 'REST APIs', 'Git', 'Jira', 'Figma', 'Claude AI'],
  },
  {
    start: '2022-06',
    end: '2023-05',
    role: 'Senior Front-End Developer',
    company: 'Design Shared Co., Ltd.',
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
    stack: ['Angular (v10–v14)', 'Angular Material', 'RxJS', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'SCSS', 'Responsive design', 'RESTful APIs', 'Git', 'Jira'],
  },
  {
    start: '2020-08',
    end: '2022-05',
    role: 'Senior Front-End Developer',
    company: 'Bay Archers Pty., Ltd.',
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
    stack: ['Angular', 'Node.js', 'Express', 'MongoDB', 'AWS Transcribe', 'Payment integration'],
  },
  {
    start: '2018-10',
    end: '2020-07',
    role: 'Front-End Developer',
    company: 'Amdon Consulting Pte., Ltd.',
    summary:
      'Grew into a key contributor on a 12-person team, building a school management system that schools relied on every day.',
    highlights: [
      'Shipped new features and upgraded existing ones across the school management application',
      'Made the system more stable and faster by resolving long-standing issues and tuning performance',
      'Built responsive, cross-browser interfaces backed by REST APIs for dynamic, data-driven features',
      'Mentored junior developers through onboarding and daily work, helping them become productive sooner',
      'Had a voice in sprint planning and technical discussions, helping shape how features were built',
    ],
    stack: ['Angular', 'TypeScript', 'RxJS', 'HTML5', 'CSS3/SCSS', 'REST APIs'],
  },
  {
    start: '2017-10',
    end: '2018-09',
    role: 'Full Stack Developer',
    company: 'ICT Star Group Myanmar',
    summary:
      'Started my career full stack, helping a 10-person team deliver a copper line management system from database to client demo.',
    highlights: [
      'Built business web applications with Java and the Spring Framework',
      'Designed and maintained the SQL databases that ran day-to-day operations',
      'Worked with the business to gather and analyse data requirements before building',
      'Took part in every stage: planning, development, testing and deployment',
      'Presented finished work directly to clients and brought their feedback back to the team',
    ],
    stack: ['Java', 'Spring Framework', 'SQL', 'HTML', 'CSS', 'JavaScript'],
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
  protected readonly visibleHighlights = VISIBLE_HIGHLIGHTS;
  protected readonly skills = SKILLS;
  protected readonly linkedin = QUICK_LINKS.find((link) => link.id === 'linkedin')?.href ?? '';
  protected readonly contact = CONTACT;
  protected readonly contactOpen = signal(false);

  protected readonly roadmap = EXPERIENCE.map((item) => ({
    ...item,
    year: item.start.slice(0, 4),
    current: !item.end,
    period: `${formatMonth(item.start)} — ${item.end ? formatMonth(item.end) : 'PRESENT'}`,
    duration: formatDuration(item),
  }));

  protected readonly stats: readonly RoadmapStat[] = [
    { value: `${this.yearsOfExperience()}+ yrs`, label: 'experience' },
    { value: 'Angular', label: 'main stack · v10 → latest' },
    { value: '70%+', label: 'test coverage raised' },
  ];

  // Companies whose full achievement list is open.
  protected readonly expanded = signal<ReadonlySet<string>>(new Set());

  protected toggle(company: string): void {
    this.expanded.update((open) => {
      const next = new Set(open);
      if (!next.delete(company)) {
        next.add(company);
      }
      return next;
    });
  }

  private yearsOfExperience(): number {
    const first = Math.min(...EXPERIENCE.map((item) => toMonthIndex(item.start)));
    return Math.floor((currentMonthIndex() - first + 1) / 12);
  }
}
