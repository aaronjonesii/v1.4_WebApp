import { Component, OnInit } from '@angular/core';
import { filter } from "rxjs/operators";
import { AuthService } from "@auth0/auth0-angular";
import { NavigationEnd, Router } from "@angular/router";
import { UrlService } from "./shared/utils/services/url.service";
import { ExtrasService } from "./shared/utils/services/extras.service";
import { SIDEBAR_MENU_ITEMS } from "./shared/utils/Sidebar-menu";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  previousUrl!: string;
  currentUrl!: string;
  SIDEBAR_MENU = SIDEBAR_MENU_ITEMS;

  constructor(
    private auth: AuthService,
    public _router: Router,
    private urlService: UrlService,
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
  }

  showStoryHeader(): boolean {
    const paths = this._router.url.split('/')
    let newStoryURL = false;if (this._router.url == '/new-story') { newStoryURL = true}
    let editStoryURL = false;if(paths.length == 4) { if(paths[1] === 'me') { if(paths[3] === 'edit') { editStoryURL= true; } } }
    return (newStoryURL || editStoryURL);
  }

}
