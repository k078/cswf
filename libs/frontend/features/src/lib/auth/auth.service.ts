import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IGebruiker } from '@cswf/shared/api';
import { JwtHelperService } from '@auth0/angular-jwt';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>(
  'AuthService'
);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //endpoint = 'http://localhost:3000/api/gebruiker';
  endpoint = 'https://cswf-backend.azurewebsites.net/api/gebruiker';
  public currentUser$ = new BehaviorSubject<IGebruiker | null>(null);
  private readonly CURRENT_USER = 'currentuser';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private readonly jwtHelper: JwtHelperService = new JwtHelperService();
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {
    this.getUserFromLocalStorage()
      .pipe(
        switchMap((user: IGebruiker | null) => {
          if (user) {
            console.log('User found in local storage');
            this.currentUser$.next(user);
            return of(user);
          } else {
            console.log(`No current user found`);
            return of(null);
          }
        })
      )
      .subscribe(() => console.log('Startup auth done'));
  }

  login(gebruikersnaam: string, wachtwoord: string): Observable<IGebruiker | null> {
    console.log(`login at ${this.endpoint}/login`);
    return this.http
      .post<{ results: IGebruiker } | null>(
        `${this.endpoint}/login`,
        { gebruikersnaam: gebruikersnaam, wachtwoord: wachtwoord },
        { headers: this.headers }
      )
      .pipe(
        map((response) => {
          if (
            response &&
            response.results &&
            response.results.token &&
            response.results.id
          ) {
            console.log('Token:', response.results.token);
            console.log('User:', response.results.id);

            localStorage.setItem(this.tokenKey, response.results.token);
            this.saveUserToLocalStorage(response.results);
            this.currentUser$.next(response.results);
            return response.results;
          } else {
            console.log('Else statement response structure:', response);
            return null;
          }
        }),
        catchError((error: any) => {
          console.log('error:', error);
          return of(null);
        })
      );
  }

  validateToken(userData: IGebruiker): Observable<IGebruiker | null> {
    const url = `${this.endpoint}/auth`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userData.token,
      }),
    };

    console.log(`validateToken at ${url}`);
    return this.http.get<any>(url, httpOptions).pipe(
      map((response) => {
        console.log('token is valid');
        return response as IGebruiker;
      }),
      catchError((error: any) => {
        console.log('Validate token Failed');
        this.currentUser$.next(null);
        return of(null);
      })
    );
  }

  logout(): void {
    console.log(`logout at ${this.endpoint}/logout`);

    this.router
      .navigate(['/login'])
      .then((success) => {
        if (success) {
          console.log('logout - removing local user info');
          localStorage.removeItem(this.CURRENT_USER);
          localStorage.removeItem(this.tokenKey);
          this.currentUser$.next(null);
        } else {
          console.log('navigate result:', success);
        }
      })
      .catch((error) => console.log('not logged out!'));
  }

  getUserFromLocalStorage(): Observable<IGebruiker | null> {
    const itemFromStorage = localStorage.getItem(this.CURRENT_USER);
    if (itemFromStorage === null) {
      return of(null);
    } else {
      const localUser = JSON.parse(itemFromStorage);
      return of(localUser);
    }
  }

  private saveUserToLocalStorage(user: IGebruiker): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  userMayEdit(itemid: number): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: IGebruiker | null) => (user ? user.id === itemid : false))
    );
  }

  public isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
