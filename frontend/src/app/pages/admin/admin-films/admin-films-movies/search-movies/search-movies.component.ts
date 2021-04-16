import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { FilmsService } from "../../../../../shared/utils/services/films.service";
import { FilmResponse, Movie } from "../../../../../shared/utils/models/films";
import { FilmMovieLinkPipe } from "../../../../../shared/utils/pipes/film-movie-link.pipe";

@Component({
  selector: 'anon-search-movies',
  templateUrl: './search-movies.component.html',
  styleUrls: ['./search-movies.component.scss']
})
export class SearchMoviesComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  movie_query = undefined;
  movie_count = 0;
  movie_results: Movie[] = [];
  movies_loaded = false;
  movies_next_page = '';
  movies_previous_page = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private filmsService: FilmsService,
    public filmMovieLinkPipe: FilmMovieLinkPipe,
  ) {
    // Get Movie Query from URL
    this.route.params.pipe(
      takeUntil(this.unsub$)
    ).subscribe(
      routeParams => {
        this.movie_query = routeParams.movie_query;
        this.filmsService.search_movies(routeParams.movie_query).pipe(takeUntil(this.unsub$)).subscribe(
          (response: FilmResponse) => {
            this.movie_count = response.count;
            this.movies_next_page = response.next;
            this.movies_previous_page = response.previous;
            this.movie_results = response.results;
          },
          console.error,
          () => {this.movies_loaded = true;this.loading = false;}
        );
      },
      console.error,
      () => {},
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
    if (this.movies_next_page !== null) this.filmsService.load(this.movies_next_page).subscribe(
      (response: FilmResponse) => {
        this.movie_count = response.count;
        this.movies_next_page = response.next;
        this.movies_previous_page = response.previous;
        this.movie_results.push(...response.results);
        this.loading = false;
      },
      console.error,
      () => {},
    );
  }

}
