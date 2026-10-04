import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { FocusId, StudioScene } from './studio-scene';

@Component({
  selector: 'page-studio',
  templateUrl: './studio.html',
  styleUrl: './studio.less',
})
export class Studio {
  private readonly mount = viewChild.required<ElementRef<HTMLElement>>('mount');
  private scene?: StudioScene;
  private destroyed = false;

  protected readonly panel = signal<FocusId | null>(null);
  protected readonly night = signal(false);

  constructor() {
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    // WebGL is browser-only; three.js is loaded in its own chunk.
    afterNextRender(async () => {
      if (!isBrowser) return;
      const { StudioScene } = await import('./studio-scene');
      if (this.destroyed) return;
      const scene = (this.scene = new StudioScene());
      scene.onPick((id) => {
        if (id === 'lamp') this.toggleNight();
        else if (id) this.focus(id);
        else if (this.panel()) this.close();
      });
      await scene.init(this.mount().nativeElement);
    });

    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.scene?.dispose();
    });
  }

  protected focus(id: FocusId): void {
    this.panel.set(id);
    this.scene?.focus(id);
  }

  protected close(): void {
    this.panel.set(null);
    this.scene?.focus(null);
  }

  protected toggleNight(): void {
    this.night.update((n) => !n);
    this.scene?.setNight(this.night());
  }
}
