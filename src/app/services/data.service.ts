import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  currentMovie: any;
  editMode = false;
  constructor(private _http: HttpClient) {}

  getAllMoviesData() {
    const movieList = localStorage.getItem('movielist');
    if (movieList) {
      return Observable.create((observer) => {
        observer.next(JSON.parse(movieList));
        observer.complete();
      });
    } else {
      return this._http.get('../../assets/movies.json');
    }
  }
  addMovie(movie) {
    const movies = JSON.parse(localStorage.getItem('movielist'));
    movies.push(movie);
    localStorage.setItem('movielist', JSON.stringify(movies));
  }
  updatedMovie(movie) {
    this.deleteMovie(movie.name);
    this.addMovie(movie);
  }
  deleteMovie(movieName) {
    const movies = JSON.parse(localStorage.getItem('movielist')).filter(movie => movie.name!==movieName);
    localStorage.setItem('movielist', JSON.stringify(movies));
  }
}
