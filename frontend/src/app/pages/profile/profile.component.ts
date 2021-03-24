import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  profile_json = null;

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.pipe(takeUntil(this.unsub$)).subscribe(
      profile => this.profile_json = JSON.parse(JSON.stringify(profile, null, 2)),
      error => console.error(error),
      () => {},
    );
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
