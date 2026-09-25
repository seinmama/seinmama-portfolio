import { Component, OnDestroy, signal } from '@angular/core';
import { WorkItem } from '../../../../core/models';
import { WORK_ITEMS } from '../../../../data/work.data';

@Component({
  selector: 'page-work',
  templateUrl: './work.html',
  styleUrl: './work.less',
})
export class Work implements OnDestroy {
  protected readonly items = WORK_ITEMS;
  protected readonly dragOver = signal<string | null>(null);

  // Dropped screenshots are local previews only (object URLs); nothing is uploaded or saved.
  private readonly previews = signal<Record<string, string>>({});

  protected previewFor(item: WorkItem): string | undefined {
    return this.previews()[item.slug] ?? item.image;
  }

  protected onDragOver(event: DragEvent, slug: string): void {
    event.preventDefault();
    this.dragOver.set(slug);
  }

  protected onDrop(event: DragEvent, slug: string): void {
    event.preventDefault();
    this.dragOver.set(null);
    this.setPreview(slug, event.dataTransfer?.files[0]);
  }

  protected onPick(event: Event, slug: string): void {
    this.setPreview(slug, (event.target as HTMLInputElement).files?.[0]);
  }

  ngOnDestroy(): void {
    Object.values(this.previews()).forEach((url) => URL.revokeObjectURL(url));
  }

  private setPreview(slug: string, file: File | undefined): void {
    if (!file?.type.startsWith('image/')) return;
    const old = this.previews()[slug];
    if (old) URL.revokeObjectURL(old);
    this.previews.update((p) => ({ ...p, [slug]: URL.createObjectURL(file) }));
  }
}
