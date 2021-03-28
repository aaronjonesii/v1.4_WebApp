import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-settings-section',
  templateUrl: './settings-section.component.html',
  styleUrls: ['./settings-section.component.scss']
})
export class SettingsSectionComponent implements OnInit {
  @Input() user: any;
  @Input() section: any;

  constructor() { }

  ngOnInit(): void {
  }

}
