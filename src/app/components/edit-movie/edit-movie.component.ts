import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss'],
})
export class EditMovieComponent implements OnInit {
  err = false;
  form: FormGroup;
  selectedGenre = {};
  genres = [];
  editMode = false;
  movie: any;
  constructor(
    private _fb: FormBuilder,
    private _data: DataService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.editMode = this._data.editMode;
    if (!this.editMode) {
      this.movie = {
        name: '',
        director: '',
        '99popularity': '',
        imdb_score: '',
        genre: [],
      };
    } else {
      this.movie = this._data.currentMovie;
      this.movie.genre.forEach((element) => {
        this.selectedGenre[element.trim()] = true;
      });
    }
    this.genres = JSON.parse(localStorage.getItem('genre'));
    this.form = this._fb.group({
      name: new FormControl(this.movie.name, [Validators.required]),
      director: new FormControl(this.movie.director, [Validators.required]),
      '99popularity': new FormControl(this.movie['99popularity'], [
        Validators.required,
      ]),
      imdb_score: new FormControl(this.movie.imdb_score, [Validators.required]),
      genre: new FormControl(this.movie.genre),
      newGenre: new FormControl(''),
    });
  }

  addMovie() {
    if (this.form.valid) {
      this.form.get('genre').setValue(Object.keys(this.selectedGenre));
      const movie = Object.assign(
        { updatedBy: localStorage.getItem('user') },
        this.form.value
      );
      if (this.editMode) {
        this._data.updatedMovie(movie);
      } else {
        this._data.addMovie(movie);
      }
      this.form.reset();
      this._router.navigate(['']);
    } else {
      this.err = true;
      setTimeout(() => {
        this.err = false;
      }, 2000);
    }
  }

  addGenre() {
    const newGenre = this.form.value.newGenre;
    this.genres.push(newGenre);
    this.selectedGenre[newGenre] = true;
    this.form.get('newGenre').setValue('');
    localStorage.setItem('genre', JSON.stringify(this.genres));
  }
  toggleGenre(genre) {
    if (this.selectedGenre[genre]) {
      delete this.selectedGenre[genre];
    } else {
      this.selectedGenre[genre] = true;
    }
  }
}
