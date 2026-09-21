import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/theme.service';
import { QUICK_LINKS } from '../../../../data/links.data';

@Component({
  selector: 'page-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {
  protected readonly theme = inject(ThemeService);
  protected readonly links = QUICK_LINKS;
}
