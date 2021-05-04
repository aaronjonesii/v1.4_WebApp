import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { AuthService } from "@auth0/auth0-angular";
import { Subject } from "rxjs";
import { AdminService } from "../../shared/utils/services/admin.service";
import { Router } from "@angular/router";

@Component({
  selector: 'anon-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  is_frontend_admin = false;

  constructor(
    public auth: AuthService,
    private admin: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Auth0 idTokenClaims Subscriber
    this.auth.idTokenClaims$.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      idTokenClaims => {
        if (this.admin.is_frontend_admin(idTokenClaims)) {
          this.is_frontend_admin = true;
        } else {
          this.router.navigateByUrl('/error/404/');
        }
      }
    );
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
