import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/theme.service';
import { SkinId } from '../../../core/models';

interface LoadingCopy {
  words: readonly string[];
  sub: string;
}

const LOADING_COPY: Record<SkinId, LoadingCopy> = {
  newspaper: {
    words: ['setting the type', 'inking the rollers', 'running the presses', 'folding the pages', 'hot off the press!'],
    sub: 'the presses are running...',
  },
  coffee: {
    words: ['grinding the beans', 'pulling the shot', 'steaming the milk', 'almost brewed'],
    sub: 'brewing something good...',
  },
  ocean: {
    words: ['catching the current', 'diving deeper', 'riding the wave', 'almost ashore'],
    sub: 'the tide is turning...',
  },
  midnight: {
    words: ['dimming the lights', 'counting the stars', 'settling in', 'almost quiet'],
    sub: 'the night is young...',
  },
  nature: {
    words: ['planting seeds', 'watching it grow', 'catching some sun', 'almost bloomed'],
    sub: 'growing steadily...',
  },
  cyberpunk: {
    words: ['jacking in', 'bypassing the firewall', 'rerouting power', 'almost online'],
    sub: 'the grid is live...',
  },
};

const DEFAULT_COPY: LoadingCopy = LOADING_COPY.cyberpunk;

// Skins without their own gif in public/loader fall back to the retro one.
const LOADER_GIFS: Partial<Record<SkinId, string>> = {
  newspaper: '/loader/loader-newspaper.gif',
  coffee: '/loader/loader-coffee.gif',
  ocean: '/loader/loader-ocean.gif',
  nature: '/loader/loader-nature.gif',
  cyberpunk: '/loader/loader-cyberpunk.gif',
};
const DEFAULT_GIF = '/loader/loader-retro.gif';
const TOTAL_DURATION_MS = 3000;

@Component({
  selector: 'flow-loading',
  templateUrl: './loading.html',
  styleUrl: './loading.less',
})
export class Loading implements OnInit, OnDestroy {
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  private interval?: ReturnType<typeof setInterval>;
  private frame?: number;
  private finished = false;

  protected readonly copy = computed(() => {
    const skin = this.theme.skin();
    return (skin && LOADING_COPY[skin]) || DEFAULT_COPY;
  });

  protected readonly gif = computed(() => {
    const skin = this.theme.skin();
    return (skin && LOADER_GIFS[skin]) || DEFAULT_GIF;
  });

  protected readonly wordIndex = signal(0);
  protected readonly progress = signal(0);
  protected readonly word = computed(() => this.copy().words[this.wordIndex()]);

  ngOnInit(): void {
    const words = this.copy().words;
    const stepMs = TOTAL_DURATION_MS / words.length;

    this.interval = setInterval(() => {
      this.wordIndex.update((i) => Math.min(i + 1, words.length - 1));
    }, stepMs);

    const start = performance.now();
    const tick = (): void => {
      const elapsed = performance.now() - start;
      this.progress.set(Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100));
      if (elapsed < TOTAL_DURATION_MS) {
        this.frame = requestAnimationFrame(tick);
      } else {
        this.finish();
      }
    };
    this.frame = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
  }

  protected skip(): void {
    this.finish();
  }

  private finish(): void {
    if (this.finished) {
      return;
    }
    this.finished = true;
    clearInterval(this.interval);
    this.progress.set(100);
    this.router.navigate(['/site']);
  }
}
