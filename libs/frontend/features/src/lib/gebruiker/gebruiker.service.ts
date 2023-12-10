import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IGebruiker } from '@cswf/shared/api';
import { Injectable } from '@angular/core';
import { VerzamelingService } from '../verzameling/verzameling.service';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class GebruikerService {
  //endpoint = 'http://localhost:3000/api/gebruiker';
  endpoint = 'https://cswf-backend.azurewebsites.net/api/gebruiker';
  user: IGebruiker[] | null = null;

  constructor(
    private readonly http: HttpClient,
    private verzamelingService: VerzamelingService
  ) {}

  public list(options?: any): Observable<IGebruiker[] | null> {
    console.log(`list ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IGebruiker[]>>(this.endpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => {
          this.user = response.results as IGebruiker[];
          return this.user;
        }),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public read(id: string | null, options?: any): Observable<IGebruiker> {
    console.log(`read ${this.endpoint}/${id}`);
    return this.http
      .get<ApiResponse<IGebruiker>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        tap(console.log),
        map((response: any) => response.results as IGebruiker),
        catchError(this.handleError)
      );
  }

  public delete(id: number): Observable<any> {
    const url = `${this.endpoint}/${id}`;

    return this.http
      .delete<ApiResponse<any>>(url)
      .pipe(catchError(this.handleError));
  }

  public register(user: IGebruiker): Observable<IGebruiker> {
    console.log(`addUser ${this.endpoint}`, user);
    const url = `${this.endpoint}`;
    return this.http.post<ApiResponse<IGebruiker>>(url, user, httpOptions).pipe(
      tap(console.log),
      map((response: any) => response.results as IGebruiker),
      catchError(this.handleError)
    );
  }

  public login(user: IGebruiker): Observable<IGebruiker> {
    console.log(`login ${this.endpoint}`, user);
    const url = `${this.endpoint}/login`;

    return this.http.post<ApiResponse<IGebruiker>>(url, user, httpOptions).pipe(
      tap(console.log),
      map((response: any) => {
        const loggedInUser = response.results as IGebruiker;
        localStorage.setItem(
          'token',
          loggedInUser.token ? loggedInUser.token : ''
        );
        return loggedInUser;
      }),
      catchError(this.handleError)
    );
  }

  public editUser(user: IGebruiker): Observable<IGebruiker> {
    console.log(`editUser ${this.endpoint}`, user);
    const url = `${this.endpoint}/${user.id}`;
    return this.http.put<ApiResponse<IGebruiker>>(url, user, httpOptions).pipe(
      tap(console.log),
      map((response: any) => response.results as IGebruiker),
      catchError(this.handleError)
    );
  }

  public isUser(username: string): boolean {
    if (this.user) {
      return this.user.some((p) => p.gebruikersnaam === username);
    }
    return false;
  }

  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in UserService', error);

    return throwError(() => new Error(error.message));
  }
}
