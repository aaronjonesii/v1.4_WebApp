import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { NbSearchService, NbSidebarService } from "@nebular/theme";
import { ExtrasService } from "../../../utils/services/extras.service";
import { Location } from "@angular/common";
import { filter, map, tap } from "rxjs/operators";

@Component({
  selector: 'anon-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  search_hint = 'Hit enter to search.';
  search_placeholder = 'Search...';

  constructor(
    public _router: Router,
    private sidebarService: NbSidebarService,
    private searchService: NbSearchService,
    private extras: ExtrasService,
    ) {
    // // Router Subscription
    // this._router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   map((event: any) => event.url)
    // ).subscribe(currentURL => this.change_search_hints(currentURL))
    // Search Service Subscription
    this.searchService.onSearchSubmit()
      .subscribe((data: any) => {
        this._router.navigateByUrl(`/admin/films/movies/search/${data.term}`);
      })
  }

  ngOnInit() {}

  toggleSidebar() { this.sidebarService.toggle(true, 'menu-sidebar'); }

}
