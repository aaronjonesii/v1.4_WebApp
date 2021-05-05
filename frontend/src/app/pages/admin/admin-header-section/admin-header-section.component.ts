import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-admin-header-section',
  templateUrl: './admin-header-section.component.html',
  styleUrls: ['./admin-header-section.component.scss']
})
export class AdminHeaderSectionComponent implements OnInit {
  @Input() page_title: string = '';
  @Input() page_subtitle: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
