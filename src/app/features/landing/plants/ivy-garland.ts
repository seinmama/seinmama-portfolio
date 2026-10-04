import { Component } from '@angular/core';

const GREENS = ['#4f7f52', '#5f9160', '#3f6e47', '#6fa36b', '#2f5e3d'];

// 22 leaves along the top of the door frame, alternating tilt, on a gentle wave.
const IVY = Array.from({ length: 22 }, (_, i) => ({
  left: +((i / 21) * 100).toFixed(2),
  top: +(1.2 * Math.sin(i * 1.3)).toFixed(2),
  rotate: i % 2 ? 2 * i : 2 * i - 45,
  color: GREENS[i % 5],
}));

// Vines hanging down the sides and centre: [left (%), sway duration (s), delay (s), leaves].
const VINES = [
  [8, 5, 0, 6],
  [92, 6, 0.6, 8],
  [50, 7, 1.2, 3],
].map(([left, dur, delay, count], v) => ({
  left,
  anim: `sway ${dur}s ease-in-out ${delay}s infinite`,
  leaves: Array.from({ length: count }, (_, i) => ({ color: GREENS[(i + v) % 5], flip: i % 2 === 1 })),
}));

// [left (%), top (vh), petal colour]
const BLOSSOMS: [number, number, string][] = [
  [6, -1.7, '#f2a7b8'],
  [17, -0.7, '#ffffff'],
  [29, -2.3, '#e5795f'],
  [41, -0.9, '#f7c6d0'],
  [54, -2.1, '#f2a7b8'],
  [66, -0.7, '#c9a3e6'],
  [78, -1.9, '#ffffff'],
  [90, -1.1, '#e5795f'],
  [98, -0.1, '#f7c6d0'],
];

/** Ivy and blossoms draped over the door frame. Size the host to the frame's width. */
@Component({
  selector: 'app-ivy-garland',
  template: `
    @for (l of ivy; track $index) {
      <i
        class="ivy"
        [style.left.%]="l.left"
        [style.top.vh]="l.top"
        [style.background]="l.color"
        [style.transform]="'rotate(' + l.rotate + 'deg)'"
      ></i>
    }
    @for (v of vines; track $index) {
      <div class="vine" [style.left.%]="v.left" [style.animation]="v.anim">
        @for (l of v.leaves; track $index) {
          <i class="vine-leaf" [class.flip]="l.flip" [style.background]="l.color"></i>
        }
      </div>
    }
    @for (b of blossoms; track $index) {
      <i class="blossom" [style.left]="'calc(' + b[0] + '% - 1.7vh)'" [style.top.vh]="b[1]" [style.--petal]="b[2]"></i>
    }
  `,
  styles: `
    @import './plants.less';
    .sway();
    :host {
      position: absolute;
      height: 0;
      pointer-events: none;
    }
    .ivy {
      position: absolute;
      width: 2.6vh;
      height: 2.2vh;
      margin-left: -1.3vh;
      border-radius: 60% 10% 60% 10%;
    }
    .vine {
      position: absolute;
      top: 1vh;
      display: flex;
      flex-direction: column;
      transform-origin: 50% 0;
    }
    .vine-leaf {
      display: block;
      flex: none;
      width: 2.2vh;
      height: 1.9vh;
      margin-left: -0.7vh;
      border-radius: 60% 10% 60% 10%;
      transform: rotate(-40deg);

      &.flip {
        margin-left: 0.7vh;
        transform: rotate(40deg);
      }
    }
    .blossom {
      .blossom-head();
      position: absolute;
      width: 3.4vh;
      height: 3.4vh;
    }
  `,
})
export class IvyGarland {
  protected readonly ivy = IVY;
  protected readonly vines = VINES;
  protected readonly blossoms = BLOSSOMS;
}
