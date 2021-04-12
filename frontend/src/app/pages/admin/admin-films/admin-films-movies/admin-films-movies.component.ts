import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { FilmsService } from "../../../../shared/utils/services/films.service";
import { FilmResponse, Movie } from "../../../../shared/utils/models/films";
import { takeUntil } from "rxjs/operators";
import { FilmMovieLinkPipe } from "../../../../shared/utils/pipes/film-movie-link.pipe";

@Component({
  selector: 'anon-admin-films-movies',
  templateUrl: './admin-films-movies.component.html',
  styleUrls: ['./admin-films-movies.component.scss']
})
export class AdminFilmsMoviesComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  movies_loaded = false;
  movies_count = 0;
  movies_next_page = '';
  movies_previous_page = '';
  movies_results: Movie[] = [];
  loading = true;

  constructor(
    private filmsService: FilmsService,
    public filmMovieLinkPipe: FilmMovieLinkPipe,
  ) {
    this.filmsService.get_movies().pipe(takeUntil(this.unsub$)).subscribe(
      (response: FilmResponse) => {
        this.movies_count = response.count;
        this.movies_next_page = response.next;
        this.movies_previous_page = response.previous;
        this.movies_results = response.results;
      },
      console.error,
      () => {this.movies_loaded = true;this.loading = false;}
    );
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  loadNext() {
    if (this.loading) { return }
    this.loading = true;
    this.filmsService.load(this.movies_next_page).subscribe(
      (response: FilmResponse) => {
        this.movies_count = response.count;
        this.movies_next_page = response.next;
        this.movies_previous_page = response.previous;
        this.movies_results.push(...response.results);
        this.loading = false;
      },
      console.error,
      () => {},
    );
  }

}
