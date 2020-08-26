import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  auth = false;
  authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  islogged:  Observable<boolean> = this.authSubject.asObservable();
  constructor() {}
  logout() {
    this.auth = false;
    this.authSubject.next(this.auth);
  }
  login() {
    this.auth = true;
    this.authSubject.next(this.auth);
  }
}
