import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: 'anon-story-socials',
  templateUrl: './story-socials.component.html',
  styleUrls: ['./story-socials.component.scss'],
})
export class StorySocialsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() contextMenuItems: any;
  @Input() story: any;
  twitterLink = ``;
  linkedinLink = ``;
  facebookLink = ``;

  constructor(@Inject('Window') window: Window) {
      setTimeout(() => {
        if (this.story.public == true) {
          let storyLink: any;
          storyLink = `https://${window.location.hostname}/public/${this.story.id}`
          this.twitterLink = `https://twitter.com/intent/tweet?url=${storyLink}`;
          this.linkedinLink = `https://www.linkedin.com/shareArticle?mini=true&url=${storyLink}`;
          this.facebookLink = `https://www.facebook.com/sharer.php?u=${storyLink}`;
        }
      }, 0);

  }

  ngOnInit() { }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
