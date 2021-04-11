import { Component, OnInit } from '@angular/core';
import { filter } from "rxjs/operators";
import { AuthService } from "@auth0/auth0-angular";
import { NavigationEnd, Router } from "@angular/router";
import { UrlService } from "./shared/utils/services/url.service";
import { ExtrasService } from "./shared/utils/services/extras.service";
import { NbMenuItem } from "@nebular/theme";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  previousUrl!: string;
  currentUrl!: string;
  MENU_ITEMS: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/admin/dashboard',
      home: true,
    },
    { title: 'BLOG', group: true },
    {
      title: 'Stories',
      icon: 'text-outline',
      link: '/admin/stories',
      children: [
        { title: 'All Stories', link: '/admin/stories' },
        { title: 'Categories', link: '' },
        { title: 'Tags', link: '' },
      ]
    },
    { title: 'Media', icon: 'image-outline' },
    { title: 'Popcorn Time Movies', icon: 'film-outline' },
  ]

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
