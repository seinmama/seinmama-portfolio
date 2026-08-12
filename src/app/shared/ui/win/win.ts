import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-win',
  templateUrl: './win.html',
  styleUrl: './win.less',
})
export class Win {
  readonly title = input('');
  readonly closable = input(false);
}
