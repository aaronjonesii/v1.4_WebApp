import { Component, Input, OnInit } from '@angular/core';
import { Blog } from '../../../shared/utils/blog/blog';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../shared/utils/blog/blog.service';
import { Location } from '@angular/common';

@Component({
  selector: 'anon-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  @Input() post: Blog = {};
  menu_items: any = [{ title: 'Edit Blog Post' }];

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.getPost();
    this.menu_items = [{ title: 'Edit Blog Post', link: `blog/post/${this.post.id}/edit` }]
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id')!.valueOf();
    this.blogService.getPost(id)
      .subscribe(post => this.post = post);
  }

  goBack(): void {
    this.location.back();
  }

}
