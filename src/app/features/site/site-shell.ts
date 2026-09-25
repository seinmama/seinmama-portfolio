import { Component, HostBinding, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ThemeService } from '../../core/theme.service';
import { AUDIENCES } from '../../data/audiences.data';
import { SKINS } from '../../data/skins.data';
import { QUICK_LINKS } from '../../data/links.data';
import { Ticker } from '../../shared/ui/ticker/ticker';
import { AudienceId } from '../../core/models';

const TICKER_ITEMS: readonly string[] = [
  '★ WELCOME TO MY CORNER OF THE WEB ★',
  "don't forget to sign the guestbook ★",
  'now playing: lo-fi beats to ship code to ★',
  'you are visitor #001337 ★',
  'last updated 07/13/2026 ★',
  'best viewed in Netscape Navigator ★',
];

@Component({
  selector: 'app-site-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Ticker],
  templateUrl: './site-shell.html',
  styleUrl: './site-shell.less',
})
export class SiteShell {
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly tickerItems = TICKER_ITEMS;
  protected readonly links = QUICK_LINKS;
  protected readonly visitorDigits = ['0', '0', '1', '3', '3', '7'];

  protected readonly isRetro = computed(() => this.theme.style() === 'retro');

  // Pages whose route sets `data: { reader: true }` (e.g. a journal post) get the full width.
  protected readonly readerMode = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.isReaderRoute()),
    ),
    { initialValue: this.isReaderRoute() },
  );

  protected readonly profileAudience = computed(() => {
    const id = this.theme.audience();
    return id ? (AUDIENCES.find((item) => item.id === id) ?? null) : null;
  });

  protected readonly profileSkin = computed(() => {
    const id = this.theme.skin();
    return id ? (SKINS.find((item) => item.id === id) ?? null) : null;
  });

  private readonly photoLoadErrors = signal<ReadonlySet<AudienceId>>(new Set());

  protected readonly showProfilePhoto = computed(() => {
    const audience = this.profileAudience();
    return !!audience?.photoUrl && !this.photoLoadErrors().has(audience.id);
  });

  protected onPhotoError(id: AudienceId): void {
    if (this.photoLoadErrors().has(id)) {
      return;
    }
    this.photoLoadErrors.set(new Set([...this.photoLoadErrors(), id]));
  }

  @HostBinding('class')
  get hostClass(): string {
    const styleClass = this.isRetro() ? 'is-retro' : 'is-modern';
    return `${this.theme.themeClass()} ${styleClass}`;
  }

  protected readonly navLinks = [
    { path: 'home', label: 'Home' },
    { path: 'blog', label: 'Journal' },
    { path: 'gallery', label: 'Gallery' },
    { path: 'work', label: 'Work' },
    { path: 'about', label: 'About' },
    { path: 'guestbook', label: 'Guestbook' },
  ];

  protected readonly summaryLine = computed(() => {
    const audienceId = this.theme.audience();
    const audience = audienceId ? AUDIENCES.find((item) => item.id === audienceId) : null;
    const audiencePart = audience ? `${audience.name} view` : 'Guest view';

    const stylePart = this.theme.style() === 'retro' ? 'Retro 1998' : 'Modern';

    const skinId = this.theme.skin();
    const skin = skinId ? SKINS.find((item) => item.id === skinId) : null;
    const skinPart = skin ? skin.name : 'Default';

    return `🖼️ ${audiencePart} · ${stylePart} · ${skinPart}`;
  });

  private isReaderRoute(): boolean {
    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return !!route?.data['reader'];
  }

  protected changeSettings(): void {
    this.router.navigate(['/flow/audience']);
  }
}
