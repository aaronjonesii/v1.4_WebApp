import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from '../../shared/utils/blog/blog.service';
import { Subscription } from 'rxjs';
import { Blog } from '../../shared/utils/blog/blog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  blogs: Blog[] = [];
  sub: Subscription;
  tags = [
    'Technology',
    'Future',
    'Health',
    'Science',
    'Business',
    'Work',
    'Culture',
    'Programming',
    'Design',
    'Productivity',
    'Cryptocurrency',
    'Artificial Intelligence',
    'Computers',
    'Operating Systems'
  ];

  constructor(
    private blogService: BlogService,
  ) {
    this.sub = this.blogService.getBlogSubject().subscribe(blogs => this.blogs = blogs);
  }

  ngOnInit(): void {
    this.blogService.updateBlogSubject();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


}
