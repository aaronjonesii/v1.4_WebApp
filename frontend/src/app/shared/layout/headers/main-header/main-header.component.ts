import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NbSidebarService } from "@nebular/theme";

@Component({
  selector: 'anon-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  constructor(
    public _router: Router,
    private sidebarService: NbSidebarService,
    ) { }

  ngOnInit() {}

  toggleSidebar() { this.sidebarService.toggle(true, 'menu-sidebar'); }

}
