import { Component, OnDestroy, OnInit } from '@angular/core';
import { async, Subject } from "rxjs";
import { AuthService } from "@auth0/auth0-angular";
import { NbMenuService } from "@nebular/theme";
import { takeUntil } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'anon-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  isAuthenticated = false;
  user: any;
  user_metadata: any;
  user_context_items = [
    // TODO: Only show Admin link to admins
    { title: 'Admin', link: '/admin', icon: 'grid-outline' },
    { title: 'Write a story', link: '/new-story', icon: 'plus-outline' },
    { title: 'Stories', link: '/me/stories', icon: 'file-text-outline' },
    { title: 'Settings', link: '/me/settings', icon: 'settings-2-outline' },
    { title: 'Log Out', icon: 'unlock-outline' }
  ];

  constructor(
    public auth: AuthService,
    private menuService: NbMenuService,
    private http: HttpClient,
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

    setTimeout(() => {
      if (this.isAuthenticated) {
        // TODO: Check for admin scope here
      }
    }, 2000)
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
