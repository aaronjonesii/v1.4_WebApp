import { Component, Input, OnInit } from '@angular/core';
import { Post } from "../../utils/models/post";

@Component({
  selector: 'anon-story-preview',
  templateUrl: './story-preview.component.html',
  styleUrls: ['./story-preview.component.scss']
})
export class StoryPreviewComponent implements OnInit {
  @Input() story: Post = {
    author: '',
    title: '',
    slug: '',
    content: '',
    read_time: 0,
    created_on: '',
    status: 0,
  };
  @Input() showBackToStoryButton: boolean = true;
  @Input() marginBottom: number = 60;

  constructor() { }

  ngOnInit() {}

}
