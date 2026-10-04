import { Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';
import { LANDING_HALL } from '../../data/studio';
import { Bouquet } from './plants/bouquet';
import { IvyGarland } from './plants/ivy-garland';
import { Monstera } from './plants/monstera';
import { SnakePlant } from './plants/snake-plant';
import { RoomScene } from './room-scene/room-scene';
import { WelcomeCard } from './welcome-card/welcome-card';

/**
 * The landing page: a hallway with a closed door. Opening it (click or Enter) swings the door,
 * floods the screen with light and zooms through the doorway into the room, where a welcome card
 * offers the 3D studio or the classic site.
 * Ported from `design_handoff_3d_studio/reference/v2/Jordan Site (standalone).html`.
 */
@Component({
  selector: 'page-room-landing',
  imports: [RoomScene, WelcomeCard, Monstera, SnakePlant, Bouquet, IvyGarland],
  templateUrl: './room-landing.html',
  styleUrl: './room-landing.less',
  host: { '(window:keydown)': 'onKey($event)' },
})
export class RoomLanding {
  /** Open the door by itself 1.2s after load. */
  readonly autoOpen = input(false);
  /** `evening` darkens the room with a navy multiply overlay. */
  readonly mood = input<'day' | 'evening'>('day');

  protected readonly hall = LANDING_HALL;
  protected readonly open = signal(false);

  constructor() {
    let timer: ReturnType<typeof setTimeout> | undefined;
    afterNextRender(() => {
      if (this.autoOpen()) timer = setTimeout(() => this.openDoor(), 1200);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }

  protected openDoor(): void {
    if (this.open()) return;
    this.open.set(true);
    // Warm up three.js while the room plays, so the "3D studio" choice opens fast.
    import('../studio/studio-scene');
  }

  protected replay(): void {
    this.open.set(false);
  }

  protected onKey(e: KeyboardEvent): void {
    if (!this.open() && e.key === 'Enter') {
      e.preventDefault();
      this.openDoor();
    }
  }
}
