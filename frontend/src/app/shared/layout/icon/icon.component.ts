import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() icon: string = '';
  @Input() icon_pack: string = '';
  @Input() icon_size: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
