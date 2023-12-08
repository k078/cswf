import { IEntity } from './entity.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Id } from '@cswf/shared/api';


const httpOptions = {
    observe: 'body',
    responseType: 'json' as const
};


export abstract class EntityService<T extends IEntity> {

    constructor(
        protected readonly http: HttpClient,
        public readonly url: string,
        public readonly endpoint: string
    ) {}

    public list(options?: any): Observable<T[] | null> {
        const endpoint = `${this.url}${this.endpoint}`;
        console.log(`list ${endpoint}`);
        return this.http
            .get<T[]>(endpoint, { ...options, ...httpOptions })
            .pipe(
                map((response: any) => response.results),
                catchError(this.handleError)
            );
    }

    public create(item: T, options?: any): Observable<T> {
        const endpoint = `${this.url}${this.endpoint}`;
        console.log(`create ${endpoint}`);
        return this.http
            .post<T>(endpoint, item, { ...options, ...httpOptions })
            .pipe(
                map((response: any) => response.results),
                catchError(this.handleError)
            );
    }

    public read(id: Id | null, options?: any): Observable<T> {
        const endpoint = `${this.url}${this.endpoint}/${id}`;
        console.log(`read ${endpoint}`);
        return this.http
            .get<T[]>(endpoint, { ...options, ...httpOptions })
            .pipe(
                map((response: any) => response.results),
                catchError(this.handleError)
            );
    }


    public update(item: T, options?: any): Observable<T> {
        const endpoint = `${this.url}${this.endpoint}/${item.id}`;
        console.log(`update ${endpoint}`);
        return this.http
            .put(endpoint, item, { ...options, ...httpOptions })
            .pipe(
                map((response: any) => response.results),
                catchError(this.handleError)
            );
    }

    public delete(id: Id, options?: any): Observable<T> {
        const endpoint = `${this.url}${this.endpoint}/${id}`;
        console.log(`delete ${endpoint}`);
        return this.http.delete(endpoint, { ...options, ...httpOptions }).pipe(
            catchError(this.handleError)
        );
    }


    handleError = (error: HttpErrorResponse): Observable<any> => {
        console.log(error);
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
            return of(false);
        } else {
            return of(false);
        }
    };

}
