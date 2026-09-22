import { AudienceId } from '../core/models';

export interface HomeCopy {
  banner: string;
  welcome: string;
}

export const HOME_COPY: Record<AudienceId, HomeCopy> = {
  recruiter: {
    banner: "here's the professional stuff up front — experience, selected work, skills and contact.",
    welcome:
      "Hi, I'm Zune. I'm a front-end developer with 8+ years of experience building web applications, mainly with Angular, TypeScript, and JavaScript. I enjoy turning ideas into simple, thoughtful interfaces and figuring out how things work behind the screen. I'm currently learning deeper into software engineering fundamentals, from data structures and algorithms to system concepts, while continuing to grow as a developer. This website is a little bit of everything — my work, things I learn, random thoughts, travel moments, and notes I want to remember. Grab a coffee and have a look around. ☕",
  },
  friend: {
    banner: "hiii!! the fun stuff is right here — journal, guestbook and what i'm into. 💛",
    welcome:
      "hiii!! so glad you're here 💛 pull up a chair, read my latest journal entries, see what i'm listening to, and PLEASE sign my guestbook before you go. missed you!",
  },
  developer: {
    banner: 'builds, code notes and the stack — dig in and steal any idea you like.',
    welcome:
      "hey! 👋 i'm jordan — a front-end dev who likes design systems, the platform, and shaving kilobytes off bundles. here's what i've been building and writing about lately.",
  },
  curious: {
    banner: "take your time and poke around — here's everything, no rush.",
    welcome:
      "welcome to my corner of the web! ✨ i'm jordan, a front-end developer. have a wander — there's a journal, some projects, things i'm into, and a guestbook to sign.",
  },
  guru: {
    banner: '',
    welcome: '',
  },
};
