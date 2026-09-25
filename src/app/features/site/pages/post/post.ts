import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BLOG_POSTS } from '../../../../data/blog.data';

@Component({
  selector: 'page-post',
  imports: [RouterLink],
  templateUrl: './post.html',
  styleUrl: './post.less',
})
export class Post {
  private readonly route = inject(ActivatedRoute);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: this.route.snapshot.paramMap.get('slug'),
  });

  private readonly index = computed(() => BLOG_POSTS.findIndex((post) => post.slug === this.slug()));

  protected readonly post = computed(() => BLOG_POSTS[this.index()] ?? null);
  protected readonly previous = computed(() => BLOG_POSTS[this.index() - 1] ?? null);
  protected readonly next = computed(() => {
    const i = this.index();
    return i >= 0 ? (BLOG_POSTS[i + 1] ?? null) : null;
  });
}
