import { Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';
import { LANDING_HALL } from '../../data/studio';
import { Studio } from '../studio/studio';
import { Bouquet } from './plants/bouquet';
import { IvyGarland } from './plants/ivy-garland';
import { Monstera } from './plants/monstera';
import { SnakePlant } from './plants/snake-plant';

/**
 * The landing page: a hallway with a closed door. Opening it (click or Enter) swings the door,
 * floods the screen with light and zooms through the doorway into the 3D studio.
 * Ported from `design_handoff_3d_studio/reference/Room Landing.dc.html`.
 */
@Component({
  selector: 'page-room-landing',
  imports: [Studio, Monstera, SnakePlant, Bouquet, IvyGarland],
  templateUrl: './room-landing.html',
  styleUrl: './room-landing.less',
  host: { '(window:keydown)': 'onKey($event)' },
})
export class RoomLanding {
  /** Open the door by itself 1.2s after load. */
  readonly autoOpen = input(false);

  protected readonly hall = LANDING_HALL;
  protected readonly open = signal(false);

  constructor() {
    let timer: ReturnType<typeof setTimeout> | undefined;
    afterNextRender(() => {
      // Fetch three.js while the door is still closed, so the studio is ready behind it.
      import('../studio/studio-scene');
      if (this.autoOpen()) timer = setTimeout(() => this.openDoor(), 1200);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }

  protected openDoor(): void {
    this.open.set(true);
  }

  protected onKey(e: KeyboardEvent): void {
    if (!this.open() && e.key === 'Enter') {
      e.preventDefault();
      this.openDoor();
    }
  }
}
