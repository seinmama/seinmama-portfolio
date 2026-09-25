import { BlogPost } from '../core/models';

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'how-i-structured-this-portfolio',
    title: 'how i structured this portfolio',
    date: 'SEP 23',
    kicker: 'FIELD NOTES',
    readMinutes: 4,
    excerpt:
      'one site, a few different portfolios — depending on who you are and what you like. heres how the project is put together.',
    tags: ['angular', 'architecture'],
    body: [
      { kind: 'heading', text: 'the idea' },
      {
        kind: 'paragraph',
        text: 'this site isnt one portfolio, its a few. before you see anything, a short flow asks who you are (recruiter, fellow dev, friend, guru or just curious), which style you like (modern or retro 1998) and which skin (coffee, ocean, nature, newspaper, midnight or cyberpunk). your answers decide how the site looks and what it shows you first.',
      },
      { kind: 'heading', text: 'two halves' },
      {
        kind: 'paragraph',
        text: 'the app is split into two features. /flow is the welcome: intro → audience → style → skins → loading. /site is the portfolio itself: one shell with the header, nav and sidebar, plus pages for home, journal, gallery, work, about and the guestbook. every page is lazy-loaded, so the flow doesnt pay for the site and the site doesnt pay for the flow.',
      },
      {
        kind: 'code',
        text: [
          'src/app/',
          '├── core/       services + models (theme, storage, guestbook)',
          '├── data/       all the copy: posts, links, skins, audiences',
          '├── features/',
          '│   ├── flow/   intro, audience, style, skins, loading',
          '│   └── site/   shell + pages',
          '└── shared/     small ui pieces (ticker, badges, image slot)',
        ].join('\n'),
      },
      { kind: 'heading', text: 'content lives in data' },
      {
        kind: 'paragraph',
        text: 'nothing i write is hard-coded in a template. posts, links, skins and audience personas are typed arrays in /data, so adding a post means adding an object — not touching a component.',
      },
      { kind: 'heading', text: 'themes in two layers' },
      {
        kind: 'paragraph',
        text: 'the look is built from css custom properties in two layers. the style layer (modern or retro) sets the shapes: corners, borders, shadows, spacing. the skin layer sets colours and fonts. both classes sit on the same element, so any style works with any skin, and components just read tokens instead of asking "am i retro?".',
      },
      { kind: 'heading', text: 'remembering you' },
      {
        kind: 'paragraph',
        text: 'a small theme service keeps your choices in angular signals and saves them to localStorage, so the site remembers you next time. the guestbook works the same way for now — it stays in your browser until theres a backend.',
      },
      { kind: 'heading', text: 'whats next' },
      {
        kind: 'paragraph',
        text: 'real post pages, a backend for the guestbook, and more skins. the structure is there so each of those is a new file, not a rewrite.',
      },
    ],
  },
  {
    slug: 'how-theme-switching-works',
    title: 'how theme switching works (angular edition)',
    date: 'SEP 23',
    kicker: 'ANGULAR',
    readMinutes: 5,
    excerpt:
      'six skins, two styles, zero page reloads. signals hold the choice, one host class applies it, and css variables do the rest.',
    tags: ['angular', 'css', 'theming'],
    body: [
      { kind: 'heading', text: 'the short version' },
      {
        kind: 'paragraph',
        text: 'a theme here is just two class names on one element: a skin like theme-coffee and a style like is-retro. angular decides which classes to put there, css decides what they mean. no component ever asks "which theme am i in?".',
      },
      { kind: 'heading', text: '1. signals hold the choice' },
      {
        kind: 'paragraph',
        text: 'a root ThemeService keeps the picks as signals, starting from whatever was saved last time. a computed signal turns the skin into a class name, so anything reading it updates automatically when the skin changes.',
      },
      {
        kind: 'code',
        text: [
          "readonly style = signal<StyleId | null>(this.storage.get('style'));",
          "readonly skin = signal<SkinId | null>(this.storage.get('skin'));",
          '',
          'readonly themeClass = computed(() => {',
          '  const skin = this.skin();',
          "  return skin ? `theme-${skin}` : 'theme-default';",
          '});',
        ].join('\n'),
      },
      { kind: 'heading', text: '2. setters save as they go' },
      {
        kind: 'paragraph',
        text: 'setSkin() and setStyle() update the signal and write it to localStorage through a tiny StorageService (it prefixes keys and skips storage when theres no browser). thats why the site remembers you on your next visit.',
      },
      { kind: 'heading', text: '3. the flow calls the setters' },
      {
        kind: 'paragraph',
        text: 'the welcome flow is the only place that changes the theme: pick a style → setStyle(), pick a skin → setSkin(), then on to the loading screen. even the loader reacts — it reads the skin signal to choose its gif.',
      },
      { kind: 'heading', text: '4. one host binding applies it' },
      {
        kind: 'paragraph',
        text: 'the site shell wraps every page, so it puts both classes on its own host element. because the getter reads signals, angular re-renders the class the moment a choice changes.',
      },
      {
        kind: 'code',
        text: [
          "@HostBinding('class')",
          'get hostClass(): string {',
          "  const styleClass = this.isRetro() ? 'is-retro' : 'is-modern';",
          '  return `${this.theme.themeClass()} ${styleClass}`;',
          '}',
        ].join('\n'),
      },
      { kind: 'heading', text: '5. css variables do the rest' },
      {
        kind: 'paragraph',
        text: 'themes.less has two layers of custom properties. skins set colours and fonts (--bg, --text, --accent). styles set shapes (--card-radius, --card-shadow, --pill-radius) built from those colours. custom properties inherit through the dom, so they reach inside every component even with view encapsulation on.',
      },
      {
        kind: 'code',
        text: [
          '.theme-coffee { --accent: #a9714b; --text: #3b2a1e; }',
          '.is-modern    { --card-radius: 14px; --card-shadow: var(--box-shadow); }',
          '.is-retro     { --card-radius: 0;    --card-shadow: 3px 3px 0 var(--text); }',
          '',
          '.card() {',
          '  border-radius: var(--card-radius);',
          '  box-shadow: var(--card-shadow);',
          '}',
        ].join('\n'),
      },
      { kind: 'heading', text: 'when css isnt enough' },
      {
        kind: 'paragraph',
        text: 'a few retro-only things (the ticker, the webring, the visitor counter) arent a different look, theyre extra content. those use @if (isRetro()) in the template. everything else is just tokens.',
      },
      { kind: 'heading', text: 'why i like it' },
      {
        kind: 'paragraph',
        text: 'adding a skin is one css block. adding a component means reading tokens, not writing retro and modern versions of it. and switching themes costs one class change — the browser does the repainting.',
      },
    ],
  },
  {
    slug: 'designing-with-ai',
    title: 'designing with ai (without losing my own idea)',
    date: 'SEP 23',
    kicker: 'PROCESS',
    readMinutes: 4,
    excerpt:
      'ai writes a lot of the code on this site. the idea, the look and the final say are still mine. heres how i keep it that way.',
    tags: ['ai', 'design', 'process'],
    body: [
      { kind: 'heading', text: 'the idea comes first' },
      {
        kind: 'paragraph',
        text: 'before asking ai for anything, i already knew what i wanted: a portfolio that changes depending on who is visiting, with a retro 1998 mode, a clean modern mode, and skins that feel like places — a coffee shop, the ocean, a newspaper. ai didnt come up with that. if you start from a blank prompt, you get a blank-looking site.',
      },
      { kind: 'heading', text: 'i bring the design, ai builds it' },
      {
        kind: 'paragraph',
        text: 'i work from my own references: a prototype of the retro homepage, mockups of each screen, and the loading gifs i made for every skin. then i hand ai a screenshot and say "make it look like this". a picture explains spacing, colour and mood better than a paragraph ever could.',
      },
      { kind: 'heading', text: 'small steps, checked every time' },
      {
        kind: 'paragraph',
        text: 'i ask for one thing at a time — update a link, add the loader, restyle the guestbook — and look at the result before the next ask. when something drifts from the design, i say so plainly ("the form doesnt match the mockup") and send the picture again.',
      },
      { kind: 'heading', text: 'saying no is part of the process' },
      {
        kind: 'paragraph',
        text: 'not every suggestion is right. ai once stretched my loading gif across the whole screen; it looked wrong, so i asked to revert it and keep it small in the middle. being able to throw an attempt away quickly is what makes experimenting cheap.',
      },
      { kind: 'heading', text: 'i make the structural calls' },
      {
        kind: 'paragraph',
        text: 'the biggest decisions are about how the code is organised, not how it looks. my components were full of "if retro, do this" checks, so i asked for a parent theme layer instead: modern and retro as tokens in themes.less, sitting above the skins. ai did the refactor; the idea of how it should be shaped was mine.',
      },
      { kind: 'heading', text: 'what ai is great at' },
      {
        kind: 'paragraph',
        text: 'the tedious parts: turning a mockup into css, moving dozens of style rules onto tokens without breaking anything, checking every skin still looks right, writing the first draft of a post like this one. that frees me up for the parts only i can do.',
      },
      { kind: 'heading', text: 'what stays mine' },
      {
        kind: 'paragraph',
        text: 'taste, direction and the final review. ai is a very fast pair of hands — but i decide what goes on the page, and nothing ships until it matches what i had in my head.',
      },
    ],
  },
  {
    slug: 'implementing-with-ai',
    title: 'implementing with ai: how i give comments',
    date: 'SEP 23',
    kicker: 'PROCESS',
    readMinutes: 5,
    excerpt:
      'ai wrote a lot of the code here — but only because i kept telling it exactly what i wanted. heres how my comments turn my idea into working angular.',
    tags: ['ai', 'process', 'angular'],
    body: [
      { kind: 'heading', text: 'short, direct comments' },
      {
        kind: 'paragraph',
        text: 'my comments are small and specific: one change at a time, with the exact thing it needs. no long essays. a few real ones from building this site:',
      },
      {
        kind: 'code',
        text: [
          '> update github link  https://github.com/seinmama',
          '> remove the remaining link',
          '> I added loader gif so you don’t need loader component',
          '> gif loading i want display the full screen',
        ].join('\n'),
      },
      {
        kind: 'paragraph',
        text: 'each one is a single job i can check in seconds. if i bundle five asks together, i cant tell which part went wrong.',
      },
      { kind: 'heading', text: 'show, dont describe' },
      {
        kind: 'paragraph',
        text: 'for anything visual i send a screenshot of my design with a one-line comment like "here is simple UI" or "update journal UI". the picture carries the spacing, colour and mood, so ai has something concrete to match instead of guessing.',
      },
      { kind: 'heading', text: 'check the result, then comment again' },
      {
        kind: 'paragraph',
        text: 'after every change i look at the real page. when it doesnt match, i say exactly that and send the picture again:',
      },
      {
        kind: 'code',
        text: ['> form text box background color is always white', '> It form not align with design'].join('\n'),
      },
      {
        kind: 'paragraph',
        text: 'that second comment led to the guestbook being rebuilt to match my mockup: white fields, softer borders, and the entries moved inside the card.',
      },
      { kind: 'heading', text: 'saying no is part of it' },
      {
        kind: 'paragraph',
        text: 'not every attempt is right. i asked for the loading gif full screen, saw it, and didnt like it, so my next comment was simply "plz revert the changes just put in the middle". throwing an attempt away is cheap, so i try things freely and keep only what fits my idea.',
      },
      { kind: 'heading', text: 'the architecture is my call' },
      {
        kind: 'paragraph',
        text: 'the most important comments arent about looks, theyre about how the code is organised. my components were full of "if retro, do this" checks, so i said:',
      },
      {
        kind: 'code',
        text: [
          '> between retro and modern theme I want to add parent theme',
          '  in theme.less rather than control with class and condition',
        ].join('\n'),
      },
      {
        kind: 'paragraph',
        text: 'ai did the refactor: it moved every retro and modern rule onto tokens and compared the styles before and after so nothing broke. the shape of the solution was my decision.',
      },
      { kind: 'heading', text: 'what i let ai do' },
      {
        kind: 'paragraph',
        text: 'the heavy lifting: turning a mockup into angular templates and less, changing dozens of style rules at once, type-checking, checking every skin still looks right, and drafting posts like this one from my notes.',
      },
      { kind: 'heading', text: 'what stays mine' },
      {
        kind: 'paragraph',
        text: 'the idea, the design, the architecture and the final review. i decide what goes on the page, and nothing stays until it matches what i had in my head.',
      },
    ],
  },
];
