import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/theme.service';
import { AUDIENCES } from '../../../../data/audiences.data';
import { HOME_COPY } from '../../../../data/home-copy.data';
import { BLOG_POSTS } from '../../../../data/blog.data';

@Component({
  selector: 'page-home',
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly teaserEntries = BLOG_POSTS.slice(0, 2);

  protected readonly audience = computed(() => {
    const id = this.theme.audience();
    return id ? (AUDIENCES.find((item) => item.id === id) ?? null) : null;
  });

  protected readonly copy = computed(() => {
    const id = this.theme.audience();
    return id ? HOME_COPY[id] : null;
  });

  protected goBlog(): void {
    this.router.navigate(['/site/blog']);
  }
}
