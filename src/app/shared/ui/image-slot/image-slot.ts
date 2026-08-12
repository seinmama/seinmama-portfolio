import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'ui-image-slot',
  templateUrl: './image-slot.html',
  styleUrl: './image-slot.less',
})
export class ImageSlot {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly ratio = input('4 / 3');

  protected readonly loaded = signal(false);

  protected onLoad(): void {
    this.loaded.set(true);
  }
}
