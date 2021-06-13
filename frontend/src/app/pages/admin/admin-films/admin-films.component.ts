import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { FilmsService } from "../../../shared/utils/services/films.service";
import { takeUntil } from "rxjs/operators";
import { ExtrasService } from "../../../shared/utils/services/extras.service";

@Component({
  selector: 'anon-admin-films',
  templateUrl: './admin-films.component.html',
  styleUrls: ['./admin-films.component.scss']
})
export class AdminFilmsComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  films_loaded = false;
  shows_count = 0;
  movies_count = 0;
  database_last_updated = '';
  database_updating = false;

  constructor(
    private filmService: FilmsService,
    private extras: ExtrasService,
  ) {
    this.get_films();
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  get_films() {
    this.filmService.get_films().pipe(takeUntil(this.unsub$)).subscribe(
      films => {
        this.shows_count = films.show_count;
        this.movies_count = films.movie_count;
        this.database_last_updated = films.last_updated;

      },
      console.error,
      () => {this.films_loaded = true;}
    );
  }

  update_database() {
    this.database_updating = true;
    this.films_loaded = false;
    this.filmService.update_films().pipe(takeUntil(this.unsub$)).subscribe(
      response => {
        this.extras.showToast(
          `${response.new_show_count} new tv shows\r\n${response.new_movie_count} new movies\r\n`,
          `${response.new_anime_count+response.new_show_count+response.new_movie_count} Films Added`,
          'success', 0);
      },
      error => {},
      () => {this.get_films();},
    );
  }

}
