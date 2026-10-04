import { AudienceId } from '../core/models';

export interface HomeCopy {
  banner: string;
  welcome: string;
}

export const HOME_COPY: Record<AudienceId, HomeCopy> = {
  recruiter: {
    banner: "here's the professional stuff up front — experience, selected work, skills and contact.",
    welcome:
      "Hi, I'm Zune, a Senior Front-End Engineer with 8+ years of experience building enterprise web apps in Angular and TypeScript. I'm currently working on an aerospace platform at Block Aero. I care about clean, reusable code, fast data-heavy UIs and solid test coverage, and I love turning complex workflows into simple interfaces. Have a look at my experience and work, and feel free to reach out. ☕",
  },
  friend: {
    banner: "hiii!! the fun stuff is right here — journal, guestbook and what i'm into. 💛",
    welcome:
      "hiii!! so glad you're here 💛 pull up a chair, read my latest journal entries, see what i'm listening to, and PLEASE sign my guestbook before you go. missed you!",
  },
  developer: {
    banner: 'builds, code notes and the stack — dig in and steal any idea you like.',
    welcome:
      "hey! 👋 i'm zune, a front-end dev who lives in angular, rxjs and ag grid. i like untangling legacy code, building reusable components and getting test coverage up. here's what i've been building and writing about lately. steal any idea you like.",
  },
  curious: {
    banner: "take your time and poke around — here's everything, no rush.",
    welcome:
      "welcome to my corner of the web! ✨ i'm zune, a front-end developer from myanmar, living in vietnam. have a wander: there's a journal, some projects, travel moments and a guestbook to sign. grab a coffee, no rush. ☕",
  },
  guru: {
    banner: '',
    welcome:
      "oh, a guru 🙇 i'm zune, a front-end dev still learning every day, lately deep in data structures, algorithms and system design. go easy on me, and if you spot something i could do better, the guestbook is all yours.",
  },
};
