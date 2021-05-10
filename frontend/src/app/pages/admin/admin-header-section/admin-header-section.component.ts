import { Component, Input, OnInit } from '@angular/core';
import { NbComponentStatus } from "@nebular/theme/components/component-status";

@Component({
  selector: 'anon-admin-header-section',
  templateUrl: './admin-header-section.component.html',
  styleUrls: ['./admin-header-section.component.scss']
})
export class AdminHeaderSectionComponent implements OnInit {
  @Input() page_title: string = '';
  @Input() page_subtitle: string = '';
  @Input() show_alert: boolean = false;
  @Input() alert_accent: NbComponentStatus = 'basic';
  @Input() alert_message: string = '';

  constructor() { }

  ngOnInit(): void {}

}
