import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { __spreadArrays } from 'tslib';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit {
  movies = [];
  form: FormGroup;
  genres: any;
  selectedGenre = {};
  isAdmin = false;
  constructor(
    private _data: DataService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._auth.islogged.subscribe((loggedIn) => (this.isAdmin = loggedIn));
    this.form = this._fb.group({
      searchValue: new FormControl(''),
      sortBy: new FormControl(),
    });
    this._data.getAllMoviesData().subscribe((data) => {
      localStorage.setItem('movielist', JSON.stringify(data));
      this.movies = data;
      const genre = localStorage.getItem('genre');
      if (genre) {
        this.genres = JSON.parse(genre);
      } else {
        const genres = [];
        data.forEach((element) => {
          element.genre.forEach((genre) => {
            genres.push(genre.trim());
          });
        });
        this.genres = [...new Set(genres)];
        localStorage.setItem('genre', JSON.stringify(this.genres));
      }
    });
  }
  searchMovie() {
    const movies = JSON.parse(localStorage.getItem('movielist'));
    this.form.get('sortBy').setValue('');
    this.movies = movies.filter((movie) => {
      const search = this.form.value.searchValue.toLowerCase();
      if (
        movie.name.toLowerCase().includes(search) ||
        movie.director.toLowerCase().includes(search)
      ) {
        return true;
      }
      return false;
    });
  }
  onSortChange() {
    const sortBy = this.form.value.sortBy;
    this.movies.sort((a, b) => {
      if (sortBy === '99popularity') {
        if (a[sortBy] - b[sortBy] >= 0) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (a[sortBy] > b[sortBy]) {
          return 1;
        } else if (a[sortBy] < b[sortBy]) {
          return -1;
        }
        return 0;
      }
    });
  }
  toggleGenre(genre) {
    if (this.selectedGenre[genre]) {
      delete this.selectedGenre[genre];
    } else {
      this.selectedGenre[genre] = true;
    }
    this.searchMovie();
    const genres = Object.keys(this.selectedGenre);
    genres.forEach((genre) => {
      this.movies = this.movies.filter((movie) =>
        movie.genre.join('').includes(genre)
      );
    });
  }
  clear() {
    this.form.get('searchValue').setValue('');
    this.selectedGenre = [];
    this.searchMovie();
  }
  addMovie() {
    this._data.editMode = false;
    this._data.currentMovie = {};
    this._router.navigate(['/edit']);
  }
  editMovie(movie) {
    this._data.currentMovie = movie;
    this._data.editMode = true;
    this._router.navigate(['/edit']);
  }
  deleteMovie(movieName) {
    this._data.deleteMovie(movieName);
    this.movies = this.movies.filter((movie) => movie.name !== movieName);
  }
}
