import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, takeUntil } from "rxjs/operators";
import { AuthService } from "@auth0/auth0-angular";
import { NavigationEnd, Router } from "@angular/router";
import { UrlService } from "./shared/utils/services/url.service";
import { ExtrasService } from "./shared/utils/services/extras.service";
import { SIDEBAR_MENU_ITEMS } from "./shared/utils/menus/sidebar-menu";
import { Subject } from "rxjs";
import { AdminService } from "./shared/utils/services/admin.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
  private unsub$: Subject<any> = new Subject<any>();
  is_frontend_admin = false;
  previousUrl!: string;
  currentUrl!: string;
  SIDEBAR_MENU = SIDEBAR_MENU_ITEMS;

  constructor(
    private auth: AuthService,
    public _router: Router,
    private urlService: UrlService,
    private admin: AdminService,
    private extras: ExtrasService,
  ) { }

  ngOnInit(): void {
    // Store previousUrl w/URL Service Subscription
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(
      (event: any) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        this.urlService.setPreviousUrl(this.previousUrl);
      }
    );
    // Auth0 idTokenClaims Subscriber
    this.auth.idTokenClaims$.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      idTokenClaims => {
        if (this.admin.is_frontend_admin(idTokenClaims)) { this.is_frontend_admin = true; }
      }
    );
  }
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }


  showStoryHeader(): boolean {
    const paths = this._router.url.split('/')
    let newStoryURL = false;if (this._router.url == '/new-story') { newStoryURL = true}
    let editStoryURL = false;if(paths.length == 4) { if(paths[1] === 'me') { if(paths[3] === 'edit') { editStoryURL= true; } } }
    return (newStoryURL || editStoryURL);
  }

}
