import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/theme.service';
import { AUDIENCES } from '../../../data/audiences.data';
import { AudienceId } from '../../../core/models';

@Component({
  selector: 'flow-audience',
  templateUrl: './audience.html',
  styleUrl: './audience.less',
})
export class Audience {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly audiences = AUDIENCES;

  protected choose(id: AudienceId): void {
    this.theme.setAudience(id);
    this.router.navigate(['/flow/skins']);
  }
}
