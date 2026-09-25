import { Component, computed, inject } from '@angular/core';
import { ImageSlot } from '../../../../shared/ui/image-slot/image-slot';
import { GALLERY_ITEMS, SECRET_GALLERY_ITEM } from '../../../../data/gallery.data';
import { QuizService } from '../../../../core/quiz.service';

@Component({
  selector: 'page-gallery',
  imports: [ImageSlot],
  templateUrl: './gallery.html',
  styleUrl: './gallery.less',
})
export class Gallery {
  private readonly quiz = inject(QuizService);

  // Besties (quiz score ≥ UNLOCK_SCORE) get the secret photo first.
  protected readonly items = computed(() =>
    this.quiz.bestie() ? [SECRET_GALLERY_ITEM, ...GALLERY_ITEMS] : GALLERY_ITEMS,
  );
}
