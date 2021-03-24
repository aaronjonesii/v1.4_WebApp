import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../../../shared/utils/blog/models/post";

@Component({
  selector: 'anon-blog-list',
  templateUrl: './list-stories.component.html',
  styleUrls: ['./list-stories.component.scss']
})
export class ListStoriesComponent implements OnInit {
  @Input() stories!: Post[];

  constructor() { }

  ngOnInit() {}

}
