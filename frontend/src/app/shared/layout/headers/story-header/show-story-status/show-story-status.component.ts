import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anon-show-story-status',
  templateUrl: './show-story-status.component.html',
  styleUrls: ['./show-story-status.component.scss']
})
export class ShowStoryStatusComponent implements OnInit {
  @Input() statusNumber: number | undefined;
  @Input() textEnabled: boolean = false;

  constructor() { }

  ngOnInit() {}

}
