import { Component, Input, OnInit } from '@angular/core';
import { Blog } from '../../../shared/utils/blog/models/blog';

@Component({
  selector: 'anon-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  @Input() blogs: Blog[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
