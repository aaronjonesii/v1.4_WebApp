import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'anon-readonly-story',
  templateUrl: './readonly-story.component.html',
  styleUrls: ['./readonly-story.component.scss'],
})
export class ReadonlyStoryComponent implements OnInit {
  @Input() story: any;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

}
