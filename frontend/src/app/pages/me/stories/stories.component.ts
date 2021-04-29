import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anon-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {
  tabs: any[] = [
    { title: 'Draft', route: './drafts', icon: 'file-text-outline', responsive: true },
    { title: 'Published', route: './published', icon: 'done-all-outline', responsive: true },
    { title: 'Unlisted', route: './unlisted', icon: 'eye-off-outline', responsive: true },
    { title: 'Trash', route: './trash', icon: 'trash-2-outline', responsive: true },
  ];

  constructor() { }

  ngOnInit() { }

}
