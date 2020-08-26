import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  err = false;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  checkLogin() {
    if (
      this.form.valid &&
      this.form.value.username === this.form.value.password
    ) {
      localStorage.setItem('user', this.form.value.username);
      this._auth.login();
      this._router.navigate(['/']);
    } else {
      this.err = true;
      setTimeout(() => {
        this.err = false;
      }, 2000);
    }
  }
}
