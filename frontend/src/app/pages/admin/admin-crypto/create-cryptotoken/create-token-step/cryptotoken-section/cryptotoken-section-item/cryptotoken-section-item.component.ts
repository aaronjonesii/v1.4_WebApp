import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-bsctoken-section-item',
  templateUrl: './cryptotoken-section-item.component.html',
  styleUrls: ['./cryptotoken-section-item.component.scss']
})
export class CryptotokenSectionItemComponent implements OnInit {
  @Input() bsctoken: any;
  @Input() fieldName: any;
  @Input() fieldDescription: any;
  @Input() ngModel_key: string = '';
  @Input() is_bsctoken_socials: any;
  @Input() is_required: boolean = false;
  @Input() field_type: string = 'text';
  @Input() select_options: any;

  constructor() { }

  ngOnInit(): void {}

}
