import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { QUIZ, UNLOCK_SCORE } from '../data/quiz.data';

const NEXT_DELAY_MS = 1300;

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly storage = inject(StorageService);

  readonly total = QUIZ.length;
  readonly index = signal(0);
  readonly score = signal(0);
  readonly picked = signal<number | null>(null);
  readonly phase = signal<'play' | 'result'>('play');

  readonly current = computed(() => QUIZ[this.index()]);
  readonly progress = computed(() => (this.index() + (this.picked() !== null ? 1 : 0)) / this.total);
  readonly isCorrect = computed(() => this.picked() === this.current().answer);
  readonly unlocked = computed(() => this.score() >= UNLOCK_SCORE);

  readonly bestie = this.storage.persisted('rh.bestie', null as { score: number } | null);

  private timeout?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timeout));
  }

  pick(i: number): void {
    if (this.picked() !== null || this.phase() !== 'play') {
      return;
    }
    this.picked.set(i);
    if (this.isCorrect()) {
      this.score.update((s) => s + 1);
    }
    this.timeout = setTimeout(() => {
      if (this.index() < this.total - 1) {
        this.index.update((n) => n + 1);
        this.picked.set(null);
      } else {
        this.phase.set('result');
      }
    }, NEXT_DELAY_MS);
  }

  restart(): void {
    clearTimeout(this.timeout);
    this.index.set(0);
    this.score.set(0);
    this.picked.set(null);
    this.phase.set('play');
  }

  /** Records the unlock, keeping the best score across attempts. */
  saveBestie(): void {
    if (!this.unlocked()) {
      return;
    }
    this.bestie.set({ score: Math.max(this.bestie()?.score ?? 0, this.score()) });
  }
}
