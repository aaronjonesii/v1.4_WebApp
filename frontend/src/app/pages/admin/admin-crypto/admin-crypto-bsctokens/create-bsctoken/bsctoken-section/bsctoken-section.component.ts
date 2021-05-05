import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-bsctoken-section',
  templateUrl: './bsctoken-section.component.html',
  styleUrls: ['./bsctoken-section.component.scss']
})
export class BsctokenSectionComponent implements OnInit {
  @Input() bsctoken: any;
  @Input() section: any;

  constructor() { }

  ngOnInit(): void {
  }

}
