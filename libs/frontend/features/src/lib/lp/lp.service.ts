import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ILp } from '@cswf/shared/api';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class LpService {
  private endpoint = 'https://cswf-backend.azurewebsites.net/api/lp';

  constructor(private readonly http: HttpClient) {}

  public list(options?: any): Observable<ILp[] | null> {
    console.log(`list ${this.endpoint}`);

    return this.http
      .get<ApiResponse<ILp[]>>(this.endpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as ILp[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public read(id: string | null, options?: any): Observable<ILp> {
    console.log(`read ${this.endpoint}`);
    return this.http
      .get<ApiResponse<ILp>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        tap(console.log),
        map((response: any) => response.results as ILp),
        catchError(this.handleError)
      );
  }

  public createLp(lp: ILp): Observable<ILp> {
    console.log(`Create LP ${this.endpoint}-add`);
    const url = `${this.endpoint}`;
    return this.http
      .post<ApiResponse<ILp>>(url, lp, httpOptions)
      .pipe(
        map((response: any) => response.results as ILp),
        catchError(this.handleError)
      );
  }

  public updateLp(lp: ILp): Observable<ILp> {
    console.log(`Update LP ${this.endpoint}`);
    const url = `${this.endpoint}/${lp.id}`;
    return this.http
      .put<ApiResponse<ILp>>(url, lp, httpOptions)
      .pipe(
        map((response: any) => response.results as ILp),
        catchError(this.handleError)
      );
  }

  public deleteLp(lpId: number): Observable<any> {
    const url = `${this.endpoint}/${lpId}`;

    return this.http.delete<ApiResponse<any>>(url).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }

  public handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in LpService', error);

    return throwError(() => new Error(error.message));
  }
}
