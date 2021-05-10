import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-cryptotoken-section',
  templateUrl: './cryptotoken-section.component.html',
  styleUrls: ['./cryptotoken-section.component.scss']
})
export class CryptotokenSectionComponent implements OnInit {
  @Input() bsctoken: any;
  @Input() section: any;

  constructor() { }

  ngOnInit(): void {
  }

}
