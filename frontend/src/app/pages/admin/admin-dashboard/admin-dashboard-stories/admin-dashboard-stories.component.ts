import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-admin-dashboard-stories',
  templateUrl: './admin-dashboard-stories.component.html',
  styleUrls: ['./admin-dashboard-stories.component.scss']
})
export class AdminDashboardStoriesComponent implements OnInit {
  @Input() stories: any;
  @Input() is_stories_loaded = false;

  constructor() { }

  ngOnInit() {}

}
