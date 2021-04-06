import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { NbDialogRef } from "@nebular/theme";
import { StoriesService } from "../../utils/services/stories.service";

@Component({
  selector: 'anon-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  @Input() story: any;

  constructor(
    protected ref: NbDialogRef<ConfirmationPopupComponent>,
    private storiesService: StoriesService,
  ) { }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  publishStory() {
    this.storiesService.publishStory(this.story);
    this.closePopup();
  }

  closePopup() {
    this.ref.close();
  }


}
