import { Component } from '@angular/core';
import { ImageSlot } from '../../../../shared/ui/image-slot/image-slot';
import { GALLERY_ITEMS } from '../../../../data/gallery.data';

@Component({
  selector: 'page-gallery',
  imports: [ImageSlot],
  templateUrl: './gallery.html',
  styleUrl: './gallery.less',
})
export class Gallery {
  protected readonly items = GALLERY_ITEMS;
}
