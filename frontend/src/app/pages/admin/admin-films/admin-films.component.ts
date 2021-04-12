import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { FilmResponse, Movie } from "../../../shared/utils/models/films";
import { FilmsService } from "../../../shared/utils/services/films.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-admin-films',
  templateUrl: './admin-films.component.html',
  styleUrls: ['./admin-films.component.scss']
})
export class AdminFilmsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
