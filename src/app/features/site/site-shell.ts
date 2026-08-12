import { Component, HostBinding, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-site-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './site-shell.html',
  styleUrl: './site-shell.less',
})
export class SiteShell {
  protected readonly theme = inject(ThemeService);

  @HostBinding('class')
  get themeClass(): string {
    return this.theme.themeClass();
  }

  protected readonly links = [
    { path: 'home', label: 'Home' },
    { path: 'work', label: 'Work' },
    { path: 'about', label: 'About' },
    { path: 'blog', label: 'Blog' },
    { path: 'gallery', label: 'Gallery' },
    { path: 'guestbook', label: 'Guestbook' },
  ];
}
