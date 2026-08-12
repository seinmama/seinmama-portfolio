import { Component } from '@angular/core';
import { BLOG_POSTS } from '../../../../data/blog.data';

@Component({
  selector: 'page-blog',
  templateUrl: './blog.html',
  styleUrl: './blog.less',
})
export class Blog {
  protected readonly posts = BLOG_POSTS;
}
