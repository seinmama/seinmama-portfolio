import { Component } from '@angular/core';

// [leaf height (vh), angle (deg), band colour]
const LEAVES: [number, number, string][] = [
  [20, -14, '#4f7f52'],
  [27, -6, '#3f6e47'],
  [30, 2, '#4f7f52'],
  [24, 9, '#3f6e47'],
  [19, 16, '#4f7f52'],
  [14, -20, '#3f6e47'],
];

/** Snake plant in a dark pot. The host is a zero-size anchor at the base of the leaves. */
@Component({
  selector: 'app-snake-plant',
  template: `
    <div class="plant">
      @for (l of leaves; track $index) {
        <i
          class="leaf"
          [style.height.vh]="l[0]"
          [style.transform]="'rotate(' + l[1] + 'deg)'"
          [style.--band]="l[2]"
        ></i>
      }
    </div>
    <div class="pot"></div>
  `,
  styles: `
    @import './plants.less';
    .sway();
    :host {
      position: absolute;
      width: 0;
      height: 0;
      pointer-events: none;
    }
    .plant {
      position: absolute;
      transform-origin: 50% 100%;
      animation: sway 7s ease-in-out 1s infinite;
    }
    .leaf {
      position: absolute;
      left: -1.6vh;
      bottom: 0;
      width: 3.2vh;
      border-radius: 50% 50% 30% 30% / 92% 92% 8% 8%;
      background: repeating-linear-gradient(0deg, var(--band) 0 1.6vh, #5f9160 1.6vh 2.3vh);
      box-shadow:
        inset 0.4vh 0 0 #c9d48a,
        inset -0.4vh 0 0 #c9d48a;
      transform-origin: 50% 100%;
    }
    .pot {
      position: absolute;
      left: -6vh;
      top: -0.4vh;
      width: 12vh;
      height: 12vh;
      border-radius: 0.6vh 0.6vh 1.6vh 1.6vh;
      background: linear-gradient(90deg, #3a3a37, #22221f);
    }
  `,
})
export class SnakePlant {
  protected readonly leaves = LEAVES;
}
