import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription } from "rxjs";

@Component({
  selector: 'anon-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() countdown_to_timestamp: any = new Date();
  @Input() countdown_end_message: string = '';
  private subscription?: Subscription;
  public dateNow = new Date();
  countdown_to_timestamp_is_null = false;
  countdown_to_timestamp_is_in_past = false;
  countdown_loaded = false;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference: any;
  public secondsToDday: any;
  public minutesToDday: any;
  public hoursToDday: any;
  public daysToDday: any;


  private getTimeDifference () {
    this.timeDifference = this.countdown_to_timestamp.getTime() - new  Date().getTime();
    if (this.timeDifference < 0) { this.countdown_to_timestamp_is_in_past = true; }
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits (timeDifference: any) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnInit() {
    if (this.countdown_to_timestamp === null) {
      this.countdown_to_timestamp_is_null = true;
      this.countdown_loaded = true;
    } else {
      this.countdown_to_timestamp = new Date(this.countdown_to_timestamp);
      this.subscription = interval(1000)
        .subscribe(x => {
          this.countdown_loaded = true;
          this.getTimeDifference();
        });
    }
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
