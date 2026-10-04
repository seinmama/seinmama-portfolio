import { Component, ViewEncapsulation, input } from '@angular/core';
import { STUDIO_SCREEN } from '../../../data/studio';

const CODE_COLORS = ['#c792ea', '#82aaff', '#c3e88d', '#f78c6c', '#89ddff', '#7a8193'];
// [width (%), indent (cqw), colour index], drawn twice so the scroll loops seamlessly.
const CODE_BASE = [[58, 0, 0], [70, 0.8, 1], [44, 0.8, 2], [62, 1.6, 4], [36, 1.6, 3], [52, 0.8, 5], [30, 0, 0], [66, 0.8, 1]];
const CODE_LINES = [...CODE_BASE, ...CODE_BASE].map(([w, ml, c]) => ({ w, ml, c: CODE_COLORS[c] }));

// Dust motes in the sunbeam: [left (cqw), top (cqw), duration (s), delay (s)].
const MOTES = [[15, 20, 7, 2.6], [19, 30, 8.5, 3.4], [24, 16, 6.5, 4.1], [27, 38, 9, 3], [31, 26, 7.5, 5], [21, 43, 8, 4.6], [35, 34, 7, 2.9]]
  .map(([x, y, d, s]) => ({ x, y, d, s }));

/**
 * The illustrated room behind the landing door: a 16:9 stage that covers the viewport and is
 * sized in `cqw`, so the whole picture scales as one. It boots up when it mounts (lamps, monitor,
 * laptop, typing). Markup is ported verbatim from `reference/v2/Jordan Site (standalone).html`,
 * so its inline styles reference the global `rl-*` keyframes below (no view encapsulation).
 */
@Component({
  selector: 'app-room-scene',
  templateUrl: './room-scene.html',
  styleUrl: './room-scene.less',
  encapsulation: ViewEncapsulation.None,
})
export class RoomScene {
  /** `evening` darkens the room with a navy multiply overlay; the lamp glows stay above it. */
  readonly mood = input<'day' | 'evening'>('day');

  protected readonly screen = STUDIO_SCREEN;
  protected readonly codeLines = CODE_LINES;
  protected readonly motes = MOTES;
}
