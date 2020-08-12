import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginViewModel, User, LoginCodeViewModel } from '../../models/authentication/authentication';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, @Inject('BASE_URL') public baseUrl: string) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    var model = new LoginViewModel();
    model.email = email;
    model.password = password;

    return this.http.post<any>(this.baseUrl + "account/login", model)
      .pipe(map(result => {
        //store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(result));
        this.currentUserSubject.next(result);
        return result;
      }));
  }

  loginWithCode(token: string) {
    var body = new LoginCodeViewModel();
    body.twoFactorCode = token;

    return this.http.post<any>(this.baseUrl + "account/loginWithCode", body)
      .pipe(map(result => {
        //store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(result));
        this.currentUserSubject.next(result);

        return result;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}
