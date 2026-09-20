import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/theme.service';
import { STYLES } from '../../../data/styles.data';
import { AUDIENCES } from '../../../data/audiences.data';
import { StyleId } from '../../../core/models';

@Component({
  selector: 'flow-style',
  templateUrl: './style.html',
  styleUrl: './style.less',
})
export class Style {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly styles = STYLES;

  protected readonly audience = computed(() => {
    const id = this.theme.audience();
    return id ? (AUDIENCES.find((item) => item.id === id) ?? null) : null;
  });

  protected choose(id: StyleId): void {
    this.theme.setStyle(id);
    this.router.navigate(['/flow/skins']);
  }

  protected back(): void {
    this.router.navigate(['/flow/audience']);
  }
}
