import { Component, OnDestroy, OnInit } from '@angular/core';
import { async, Subject } from "rxjs";
import { AuthService } from "@auth0/auth0-angular";
import { NbMenuService } from "@nebular/theme";
import { takeUntil } from "rxjs/operators";
import { HttpClient } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { AdminService } from "../../../utils/services/admin.service";

@Component({
  selector: 'anon-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  isAuthenticated = false;
  user: any;
  user_idTokenClaims: any;
  user_context_items = [
    { title: 'Write a story', link: '/new-story', icon: 'plus-outline' },
    { title: 'Stories', link: '/me/stories', icon: 'file-text-outline' },
    { title: 'Settings', link: '/me/settings', icon: 'settings-2-outline' },
    { title: 'Log Out', icon: 'unlock-outline' },
  ];

  constructor(
    public auth: AuthService,
    private menuService: NbMenuService,
    private admin: AdminService,
  ) { }

  ngOnInit() {
    // User Context Menu Subscriber
    this.menuService.onItemClick().pipe(
      takeUntil(this.unsub$)
    ).subscribe((event) => {
      if (event.item.title === 'Log Out') { this.auth.logout() }
    });
    // Auth0 isAuthenticated Subscriber
    this.auth.isAuthenticated$.pipe(
      takeUntil(this.unsub$)
    ).subscribe((isAuthenticated) => this.isAuthenticated = isAuthenticated );
    // Auth0 user Subscriber
    this.auth.user$.pipe(
      takeUntil(this.unsub$)
    ).subscribe((user) => this.user = user );
    // Auth0 idTokenClaims Subscriber
    this.auth.idTokenClaims$.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      idTokenClaims => {
        if (this.admin.is_frontend_admin(idTokenClaims)) {
          let add_admin_button = true;
          for (let item of this.user_context_items) { if (item.title === 'Admin') { add_admin_button = false } }
          if (add_admin_button) this.user_context_items.unshift({ title: 'Admin', link: '/admin', icon: 'grid-outline' },)
        }
      }
    );
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
