import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-bsctoken-section-item',
  templateUrl: './bsctoken-section-item.component.html',
  styleUrls: ['./bsctoken-section-item.component.scss']
})
export class BsctokenSectionItemComponent implements OnInit {
  @Input() bsctoken: any;
  @Input() fieldName: any;
  @Input() fieldDescription: any;
  @Input() ngModel_key: string = '';
  @Input() is_bsctoken_socials: any;
  @Input() is_required: boolean = false;
  @Input() field_type: string = 'text';

  constructor() { }

  ngOnInit(): void {}

}
