import { Component, OnInit } from '@angular/core';
import { filter, mergeMap } from "rxjs/operators";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  constructor(
    private auth: AuthService,
    public _router: Router,
  ) { }

  ngOnInit(): void {
    this.auth.error$.pipe(
      filter(e => e.message === 'Login required'),
      mergeMap(() => this.auth.loginWithRedirect())
    ).subscribe();
  }
}
