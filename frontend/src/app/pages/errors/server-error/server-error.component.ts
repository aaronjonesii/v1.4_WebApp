import { Component, OnDestroy, OnInit } from '@angular/core';
import { UrlService } from "../../../shared/utils/services/url.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  previousURL: any;
  timesup: boolean = false;
  minutes_of_countdown = 0.5;
  counter_in_seconds = this.minutes_of_countdown*60
  hrefContactUs = 'mailto:anonsystems@protonmail.com?subject=Website Server Errors&body=Unable to connect to server(anonsys.tech), I was on … page and wanted to … ';


  constructor(private urlService: UrlService) { }

  ngOnInit() {
    this.urlService.previousUrl$.pipe(
      takeUntil(this.unsub$)
    ).subscribe(previousURL => this.previousURL = previousURL);
    this.startCountdown();
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  startCountdown() {
    // Run every 1 second(1000ms)
    const interval = setInterval(() => {
      // Subtract 1 from counter
      this.counter_in_seconds--;
      if (this.counter_in_seconds < 0) {
        clearInterval(interval);
        this.timesup = true;
      }
    }, 1000);
  }

}
