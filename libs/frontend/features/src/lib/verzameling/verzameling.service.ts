import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IVerzameling } from '@cswf/shared/api';
import { Injectable } from '@angular/core';
import { ApiResponseInterceptor, CreateVerzamelingDto } from '@cswf/backend/dto';
import { HttpHeaders } from '@angular/common/http';



/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

/**
 *
 *
 */
@Injectable()
export class VerzamelingService {
    endpoint = 'http://localhost:3000/api/verzameling';
    //endpoint = 'https://cswf-backend.azurewebsites.net/api/verzameling';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IVerzameling[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IVerzameling[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IVerzameling[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IVerzameling> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<IVerzameling>>(`${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IVerzameling),
                catchError(this.handleError)
            );
    }

    /**
     * Create a new item.
     *
     */
    public voegVerzamelingToe(verzameling: IVerzameling): Observable<IVerzameling> {
      console.log(`Voeg verzameling toe ${this.endpoint}`);
      const url = `${this.endpoint}`;
      return this.http
        .post<ApiResponse<IVerzameling>>(url, verzameling, httpOptions)
        .pipe(
          map((response: any) => response.results as IVerzameling),
          catchError(this.handleError)
        );
    }

    /**
     * Update an item.
     *
     */
    public updateVerzameling(verzameling: IVerzameling): Observable<IVerzameling> {
      console.log(`Update verzameling ${this.endpoint}`);
      const url = `${this.endpoint}/${verzameling.id}`;
      return this.http
        .put<ApiResponse<IVerzameling>>(url, verzameling, httpOptions)
        .pipe(
          map((response: any) => response.results as IVerzameling),
          catchError(this.handleError)
        );
    }


    // Verwijder een verzameling
    public verwijderVerzameling(verzamelingId: number): Observable<any> {
      const url = `${this.endpoint}/${verzamelingId}`;

      return this.http.delete<ApiResponse<any>>(url).pipe(
        tap(console.log),
        catchError(this.handleError)
      );

    }

    public addToVerzameling(lpId: number, verzamelingId: number): Observable<any> {
      const url = `${this.endpoint}/add-to-verzameling/${lpId}/${verzamelingId}`;

      return this.http.post<ApiResponse<any>>(url, {}, httpOptions).pipe(
        tap(console.log),
        catchError(this.handleError)
      );
    }


    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in VerzamelingService', error);

        return throwError(() => new Error(error.message));
    }
}
