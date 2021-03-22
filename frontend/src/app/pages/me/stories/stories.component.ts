import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anon-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {
  tabs: any[] = [
    { title: 'Draft', route: './drafts' },
    { title: 'Published', route: './public' },
    { title: 'Unlisted', route: './unlisted' },
  ];

  constructor() { }

  ngOnInit() { }

}
