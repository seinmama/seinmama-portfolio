import { Component } from '@angular/core';
import { WORK_ITEMS } from '../../../../data/work.data';

@Component({
  selector: 'page-work',
  templateUrl: './work.html',
  styleUrl: './work.less',
})
export class Work {
  protected readonly items = WORK_ITEMS;
}
