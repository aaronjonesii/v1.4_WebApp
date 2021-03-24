import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../../shared/utils/blog/models/post";

@Component({
  selector: 'anon-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  @Input() stories!: Post[];

  constructor() { }

  ngOnInit() {}

}
