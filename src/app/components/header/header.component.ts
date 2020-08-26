import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  authenticated = false;
  constructor(private _auth: AuthenticationService, private _router: Router) {}

  ngOnInit(): void {
    this._auth.islogged.subscribe((data) => {
      this.authenticated = data;
    });
  }
  logout() {
    localStorage.removeItem('user');
    this._auth.logout();
    this._router.navigate(['/']);
  }
  login() {
    this._router.navigate(['/login']);
  }
}
