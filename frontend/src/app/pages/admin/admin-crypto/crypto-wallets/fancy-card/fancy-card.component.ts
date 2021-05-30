import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-fancy-card',
  templateUrl: './fancy-card.component.html',
  styleUrls: ['./fancy-card.component.scss']
})
export class FancyCardComponent implements OnInit {
  @Input() title: string = 'Default string';
  @Input() message: any = 'Default message';
  @Input() icon: string = '';
  @Input() icon_pack: string = '';
  @Input() color: string = '';
  background_color = '';


  constructor() { }

  ngOnInit(): void {
    // this.background_color = this.color;
    let color_numbers = this.get_color_numbers(this.color)
    this.background_color = `linear-gradient(125deg, rgba(${color_numbers}, 0.25), rgba(${color_numbers}, 0.5), rgba(${color_numbers}, 0.75), rgba(${color_numbers}, 1))`;
  }

  get_color_numbers(rgb_color: any) {
    let rgb_color_numbers = rgb_color
      .substring(4, rgb_color.length-1)
      .replace(/ /g, '')
      .split(',');
    return rgb_color_numbers
  }

}
