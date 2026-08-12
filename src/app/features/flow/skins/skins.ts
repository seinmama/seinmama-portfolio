import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/theme.service';
import { SKINS } from '../../../data/skins.data';
import { SkinId } from '../../../core/models';

@Component({
  selector: 'flow-skins',
  templateUrl: './skins.html',
  styleUrl: './skins.less',
})
export class Skins {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly skins = SKINS;

  protected choose(id: SkinId): void {
    this.theme.setSkin(id);
    this.router.navigate(['/flow/terminal']);
  }
}
