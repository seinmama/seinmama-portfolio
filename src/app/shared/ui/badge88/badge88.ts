import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-badge88',
  templateUrl: './badge88.html',
  styleUrl: './badge88.less',
})
export class Badge88 {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly href = input<string | null>(null);
}
