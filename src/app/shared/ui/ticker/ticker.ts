import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-ticker',
  templateUrl: './ticker.html',
  styleUrl: './ticker.less',
})
export class Ticker {
  readonly items = input<readonly string[]>([]);
  readonly speedSeconds = input(20);
}
