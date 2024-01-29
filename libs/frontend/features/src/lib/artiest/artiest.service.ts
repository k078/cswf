import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IArtiest } from '@cswf/shared/api';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class ArtiestService {
  endpoint = 'https://cswf-backend.azurewebsites.net/api/artiest';
  //endpoint = 'http://localhost:3000/api/artiest';

  gebruiker = this.authService.currentUser$.value?.gebruikersnaam;
  constructor(private readonly http: HttpClient, private authService: AuthService) {
  }

  public list(options?: any): Observable<IArtiest[] | null> {
    console.log(`list ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IArtiest[]>>(this.endpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IArtiest[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public read(id: string | null, options?: any): Observable<IArtiest> {
    console.log(`read ${this.endpoint}`);
    return this.http
      .get<ApiResponse<IArtiest>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        tap(console.log),
        map((response: any) => response.results as IArtiest),
        catchError(this.handleError)
      );
  }

  public createArtiest(Artiest: IArtiest): Observable<IArtiest> {
    console.log(`Create Artiest ${this.endpoint}-add`);
    const url = `${this.endpoint}`;
    return this.http
      .post<ApiResponse<IArtiest>>(url, Artiest, httpOptions)
      .pipe(
        map((response: any) => response.results as IArtiest),
        catchError(this.handleError)
      );
  }

  public updateArtiest(Artiest: IArtiest): Observable<IArtiest> {
    console.log(`Update Artiest ${this.endpoint}`);
    const url = `${this.endpoint}/${Artiest.id}`;
    return this.http
      .put<ApiResponse<IArtiest>>(url, Artiest, httpOptions)
      .pipe(
        map((response: any) => response.results as IArtiest),
        catchError(this.handleError)
      );
  }

  public deleteArtiest(ArtiestId: number): Observable<any> {
    const url = `${this.endpoint}/${ArtiestId}`;

    return this.http.delete<ApiResponse<any>>(url).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }

  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in ArtiestService', error);

    return throwError(() => new Error(error.message));
  }
}
