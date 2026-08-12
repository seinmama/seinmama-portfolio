import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/theme.service';

@Component({
  selector: 'page-home',
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {
  protected readonly theme = inject(ThemeService);
}
