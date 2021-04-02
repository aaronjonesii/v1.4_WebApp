import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-story-settings-section',
  templateUrl: './story-settings-section.component.html',
  styleUrls: ['./story-settings-section.component.scss']
})
export class StorySettingsSectionComponent implements OnInit {
  @Input() story: any;
  @Input() section: any;

  constructor() { }

  ngOnInit(): void {
  }

}
