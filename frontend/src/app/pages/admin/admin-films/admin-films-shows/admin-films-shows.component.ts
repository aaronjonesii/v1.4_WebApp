import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { FilmResponse, Show } from "../../../../shared/utils/models/films";
import { FilmsService } from "../../../../shared/utils/services/films.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'anon-admin-films-shows',
  templateUrl: './admin-films-shows.component.html',
  styleUrls: ['./admin-films-shows.component.scss']
})
export class AdminFilmsShowsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  shows_loaded = false;
  shows_count = 0;
  shows_next_page = '';
  shows_previous_page = '';
  shows_results: Show[] = [];

  constructor(private filmsService: FilmsService) {
    this.filmsService.get_shows().pipe(takeUntil(this.unsub$)).subscribe(
      (response: FilmResponse) => {
        this.shows_count = response.count;
        this.shows_next_page = response.next;
        this.shows_previous_page = response.previous;
        this.shows_results = response.results;
      },
      console.error,
      () => { this.shows_loaded = true; },
    );
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
