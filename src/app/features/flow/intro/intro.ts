import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

const SITE_OWNER = 'Sein Ma Ma';

const BOOT_LINES: readonly string[] = [
  '> BOOTING PERSONAL-HOMEPAGE.EXE ...',
  '> loading glitter.dll ............. OK',
  '> loading marquee.dll ............ OK',
  '> mounting /guestbook ........... OK',
  '> establishing dial-up connection',
  '  ...beeep... kshhhh... CONNECTED',
  '',
  `> Welcome to ${SITE_OWNER}'s homepage!`,
  '> next: tell me who is visiting',
];

const CHAR_DELAY_MS = 22;
const LINE_PAUSE_MS = 230;
const START_DELAY_MS = 400;

@Component({
  selector: 'flow-intro',
  templateUrl: './intro.html',
  styleUrl: './intro.less',
})
export class Intro implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private timer?: ReturnType<typeof setTimeout>;

  protected readonly introText = signal('');
  protected readonly ready = signal(false);

  ngOnInit(): void {
    this.timer = setTimeout(() => this.typeLine(0, 0, ''), START_DELAY_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private typeLine(lineIndex: number, charIndex: number, out: string): void {
    if (lineIndex >= BOOT_LINES.length) {
      this.ready.set(true);
      return;
    }
    const line = BOOT_LINES[lineIndex];
    if (charIndex <= line.length) {
      this.introText.set(out + line.slice(0, charIndex));
      this.timer = setTimeout(() => this.typeLine(lineIndex, charIndex + 1, out), CHAR_DELAY_MS);
    } else {
      const next = out + line + '\n';
      this.introText.set(next);
      this.timer = setTimeout(() => this.typeLine(lineIndex + 1, 0, next), LINE_PAUSE_MS);
    }
  }

  @HostListener('document:keydown.enter')
  protected onEnterKey(): void {
    if (this.ready()) {
      this.continue();
    }
  }

  protected onIntroClick(): void {
    if (this.ready()) {
      this.continue();
    }
  }

  protected continue(): void {
    this.router.navigate(['/flow/audience']);
  }
}
