import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/theme.service';
import { SKINS } from '../../../data/skins.data';
import { AUDIENCES } from '../../../data/audiences.data';
import { AUDIENCE_SKINS } from '../../../data/audience-skins.data';
import { SkinId } from '../../../core/models';

@Component({
  selector: 'flow-skins',
  templateUrl: './skins.html',
  styleUrl: './skins.less',
})
export class Skins {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  private readonly selected = signal<SkinId | null>(null);

  protected readonly audience = computed(() => {
    const id = this.theme.audience();
    return id ? (AUDIENCES.find((item) => item.id === id) ?? null) : null;
  });

  protected readonly skins = computed(() => {
    const audienceId = this.theme.audience();
    const shortlist = audienceId ? AUDIENCE_SKINS[audienceId] : null;
    const isModern = this.theme.style() === 'modern';

    let list = shortlist && shortlist.length > 0 ? SKINS.filter((skin) => shortlist.includes(skin.id)) : SKINS;
    if (isModern) {
      list = list.filter((skin) => skin.id !== 'cyberpunk');
    }
    return list;
  });

  protected readonly activeId = computed(() => this.selected() ?? this.skins()[0]?.id ?? null);

  protected preview(id: SkinId): void {
    this.selected.set(id);
    this.theme.setSkin(id);
  }

  protected back(): void {
    this.router.navigate(['/flow/style']);
  }

  protected enter(): void {
    const id = this.activeId();
    if (id) {
      this.theme.setSkin(id);
    }
    this.router.navigate(['/flow/loading']);
  }
}
