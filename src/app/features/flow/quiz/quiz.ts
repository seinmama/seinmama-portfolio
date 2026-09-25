import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/theme.service';
import { QuizService } from '../../../core/quiz.service';
import { Win } from '../../../shared/ui/win/win';
import { CHEERS, RESULT_TITLES, UNLOCK_SCORE } from '../../../data/quiz.data';

interface ConfettiPiece {
  id: string;
  dx: string;
  dy: string;
  r: string;
  color: string;
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const CONFETTI_COUNT = 26;
const CONFETTI_MS = 1250;
const CONFETTI_COLORS = ['var(--accent)', 'var(--accent2)', '#ffe600', '#3ddc62', '#ff8fc4', '#fff'];
const COUNT_STEP_MS = 260;

@Component({
  selector: 'flow-quiz',
  imports: [Win],
  templateUrl: './quiz.html',
  styleUrl: './quiz.less',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Quiz {
  protected readonly theme = inject(ThemeService);
  protected readonly quiz = inject(QuizService);
  private readonly router = inject(Router);

  protected readonly letters = LETTERS;
  protected readonly unlockScore = UNLOCK_SCORE;
  protected readonly isModern = computed(() => this.theme.style() === 'modern');
  protected readonly title = computed(() => RESULT_TITLES[this.quiz.score()] ?? '');

  // A different cheer per question, stable while the reaction is showing.
  protected readonly cheer = computed(() => CHEERS[this.quiz.index() % CHEERS.length]);
  protected readonly correctOption = computed(() => {
    const q = this.quiz.current();
    return q.options[q.answer];
  });

  protected readonly confetti = signal<ConfettiPiece[]>([]);
  private bursts = 0;

  protected readonly shown = signal(0);

  private readonly card = viewChild<ElementRef<HTMLElement>>('card');
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private countUp?: ReturnType<typeof setInterval>;

  constructor() {
    this.quiz.restart();

    // Keep focus on the card whenever a new question mounts.
    afterRenderEffect(() => {
      this.quiz.current();
      this.card()?.nativeElement.focus({ preventScroll: true });
    });

    effect(() => {
      if (this.quiz.phase() !== 'result') {
        return;
      }
      untracked(() => this.startCountUp());
    });

    inject(DestroyRef).onDestroy(() => {
      this.timers.forEach(clearTimeout);
      clearInterval(this.countUp);
    });
  }

  protected pick(i: number): void {
    if (this.quiz.picked() !== null) {
      return;
    }
    this.quiz.pick(i);
    if (this.quiz.isCorrect()) {
      this.burst();
    }
  }

  protected optionState(i: number): 'right' | 'wrong' | 'dim' | null {
    const picked = this.quiz.picked();
    if (picked === null) {
      return null;
    }
    const answer = this.quiz.current().answer;
    if (i === answer) {
      return 'right';
    }
    return i === picked ? 'wrong' : 'dim';
  }

  protected restart(): void {
    clearInterval(this.countUp);
    this.shown.set(0);
    this.quiz.restart();
  }

  protected enter(): void {
    this.quiz.saveBestie();
    this.router.navigate(['/flow/loading']);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (this.quiz.phase() === 'result') {
      if (event.key === 'Enter' && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        this.enter();
      }
      return;
    }
    const key = event.key.toUpperCase();
    const i = '1234'.includes(key) ? Number(key) - 1 : LETTERS.indexOf(key as (typeof LETTERS)[number]);
    if (i >= 0 && key.length === 1) {
      event.preventDefault();
      this.pick(i);
    }
  }

  private burst(): void {
    const round = ++this.bursts;
    this.confetti.set(
      Array.from({ length: CONFETTI_COUNT }, (_, n) => {
        const angle = (n / CONFETTI_COUNT) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 90 + Math.random() * 110;
        return {
          id: `${round}-${n}`,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist - 60}px`,
          r: `${Math.round(Math.random() * 720 - 360)}deg`,
          color: CONFETTI_COLORS[n % CONFETTI_COLORS.length],
        };
      }),
    );
    this.later(() => {
      if (this.bursts === round) {
        this.confetti.set([]);
      }
    }, CONFETTI_MS);
  }

  private startCountUp(): void {
    clearInterval(this.countUp);
    this.shown.set(0);
    const target = this.quiz.score();
    if (target === 0) {
      return;
    }
    this.countUp = setInterval(() => {
      this.shown.update((n) => n + 1);
      if (this.shown() >= target) {
        clearInterval(this.countUp);
      }
    }, COUNT_STEP_MS);
  }

  private later(fn: () => void, ms: number): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
  }
}
