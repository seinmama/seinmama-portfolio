import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../../../../data/blog.data';

@Component({
  selector: 'page-blog',
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.less',
})
export class Blog {
  protected readonly posts = BLOG_POSTS;
}
