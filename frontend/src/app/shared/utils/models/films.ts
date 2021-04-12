export interface FilmResponse {
  count: number;
  next: string;
  previous: string;
  results: any;
}

export interface Anime {
  _id: string;
  mal_id: string;
  title: string;
  year: string;
  slug: string;
  synopsis: object;
  runtime: string;
  status: string;
  type: string;
  last_updated: number;
  episodes: object;
  genres: string;
  images: object;
  latest_episode: number;
  rating: string;
  num_seasons: number;
  _v: number;

}

export interface Movie {
  _id: string;
  imdb_id: string;
  title: string;
  year: string;
  slug: string;
  synopsis: object;
  runtime: string;
  country: string;
  last_updated: number;
  released: number;
  certification: string;
  torrents: object;
  trailer: string;
  genres: string;
  images: object;
  rating: string;
  _v: number;
}

export interface Show {
  _id: string;
  imdb_id: string;
  tvdb_id: string;
  title: string;
  year: string;
  slug: string;
  synopsis: object;
  runtime: string;
  country: string;
  network: string;
  air_day: string;
  air_time: string;
  status: number;
  num_seasons: number;
  last_updated: number;
  episodes: object;
  latest_episode: number;
  genres: string;
  images: object;
  rating: string;
  _v: number;
}
