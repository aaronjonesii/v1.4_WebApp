import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-profile-settings-section',
  templateUrl: './profile-settings-section.component.html',
  styleUrls: ['./profile-settings-section.component.scss']
})
export class ProfileSettingsSectionComponent implements OnInit {
  @Input() user: any;
  @Input() section: any;

  constructor() { }

  ngOnInit(): void {
  }

}
