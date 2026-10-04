import { Component } from '@angular/core';

// [stem angle (deg), stem length (vh), leaf colour]; each leaf leans back by 35% of its stem angle.
const STEMS: [number, number, string][] = [
  [-55, 22, '#4f7f52'],
  [-30, 28, '#5f9160'],
  [-8, 32, '#3f6e47'],
  [14, 30, '#6fa36b'],
  [38, 26, '#2f5e3d'],
  [60, 20, '#4f7f52'],
  [-75, 15, '#5f9160'],
];

/** Monstera in a cream pot. The host is a zero-size anchor at the base of the stems. */
@Component({
  selector: 'app-monstera',
  template: `
    <div class="plant">
      @for (s of stems; track $index) {
        <div class="stem" [style.height.vh]="s[1]" [style.transform]="'rotate(' + s[0] + 'deg)'">
          <i class="leaf" [style.background]="s[2]" [style.transform]="'rotate(' + -s[0] * 0.35 + 'deg)'"></i>
        </div>
      }
    </div>
    <div class="shadow"></div>
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
      animation: sway 6s ease-in-out infinite;
    }
    .stem {
      position: absolute;
      left: -0.3vh;
      bottom: 0;
      width: 0.6vh;
      background: #4c7a45;
      transform-origin: 50% 100%;
    }
    .leaf {
      position: absolute;
      left: -6vh;
      top: -8vh;
      width: 12.6vh;
      height: 10vh;
      border-radius: 50% 50% 46% 46% / 62% 62% 38% 38%;
      -webkit-mask: linear-gradient(90deg, #000 48.5%, transparent 48.5% 51.5%, #000 51.5%);
      mask: linear-gradient(90deg, #000 48.5%, transparent 48.5% 51.5%, #000 51.5%);
      box-shadow: inset 0 -0.8vh 1.6vh rgba(0, 0, 0, 0.15);
    }
    .shadow {
      position: absolute;
      left: -7vh;
      top: 15vh;
      width: 14vh;
      height: 2.6vh;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(30, 25, 15, 0.35), rgba(30, 25, 15, 0) 70%);
    }
    .pot {
      position: absolute;
      left: -7vh;
      top: -0.4vh;
      width: 14vh;
      height: 16vh;
      clip-path: polygon(0 0, 100% 0, 88% 100%, 12% 100%);
      background: linear-gradient(90deg, #f4f0e8, #d9d2c4);
      box-shadow: inset 0 1.2vh 0 #cfc7b7;
    }
  `,
})
export class Monstera {
  protected readonly stems = STEMS;
}
