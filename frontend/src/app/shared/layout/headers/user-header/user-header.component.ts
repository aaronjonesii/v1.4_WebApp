import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { AuthService } from "@auth0/auth0-angular";
import { NbMenuService } from "@nebular/theme";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  user_context_items = [
    { title: 'Write a story', link: '/new-story', icon: 'plus-outline' },
    { title: 'Stories', link: '/me/stories', icon: 'file-text-outline' },
    { title: 'Settings', link: '/me/settings', icon: 'settings-2-outline' },
    { title: 'Log Out', icon: 'unlock-outline' }
  ];

  constructor(
    public auth: AuthService,
    private menuService: NbMenuService,
  ) { }

  ngOnInit() {
    // User Context Menu Subscriber
    this.menuService.onItemClick().pipe(
      takeUntil(this.unsub$)
    ).subscribe((event) => {
      if (event.item.title === 'Log Out') { this.auth.logout() }
    });
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
