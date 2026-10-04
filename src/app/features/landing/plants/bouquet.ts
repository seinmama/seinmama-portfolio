import { Component, computed, input } from '@angular/core';

// [stem length (vh), angle (deg), petal colour]
const STEMS: [number, number, string][] = [
  [16, -26, '#f2a7b8'],
  [21, -12, '#ffffff'],
  [24, 0, '#e5795f'],
  [20, 12, '#f7c6d0'],
  [15, 25, '#c9a3e6'],
  [14, -5, '#f7d06b'],
  [13, 6, '#f2a7b8'],
];

/** A terracotta bucket of mixed flowers. The host is a zero-size anchor at the base of the stems. */
@Component({
  selector: 'app-bouquet',
  template: `
    <div class="plant">
      @for (s of shown(); track $index) {
        <div class="stem" [style.height.vh]="s[0]" [style.transform]="'rotate(' + s[1] + 'deg)'">
          <i class="blossom" [style.--petal]="s[2]"></i>
        </div>
      }
    </div>
    <div class="bucket"></div>
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
      animation: sway 5s ease-in-out 0.5s infinite;
    }
    .stem {
      position: absolute;
      left: -0.2vh;
      bottom: 0;
      width: 0.4vh;
      background: #4c7a45;
      transform-origin: 50% 100%;
    }
    .blossom {
      .blossom-head();
      position: absolute;
      left: -2.1vh;
      top: -2.3vh;
      width: 4.6vh;
      height: 4.6vh;
    }
    .bucket {
      position: absolute;
      left: -5vh;
      top: -0.4vh;
      width: 10vh;
      height: 9.4vh;
      clip-path: polygon(0 0, 100% 0, 86% 100%, 14% 100%);
      background: linear-gradient(90deg, #e8a581, #c97a57);
    }
  `,
})
export class Bouquet {
  /** How many flower stems (up to 7). */
  readonly stems = input(STEMS.length);

  protected readonly shown = computed(() => STEMS.slice(0, this.stems()));
}
