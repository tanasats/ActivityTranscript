import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
const endpoint = 'http://localhost:3000/api/v1/user';
//const endpoint = 'http://192.168.1.51:3000/api/v1/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  get httpOptions() {
    let token = localStorage.getItem('access-token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-access-token': token,
      }),
    };
  }

  private handleError(error: HttpErrorResponse) {
    //console.log('this is pipe(catchError()) in user.service-->');
    //console.log(error);
    switch (error.status) {
      case 0:
        return throwError('backend out of service');
        break;
      case 400:
        return throwError(error.error);
        break;
      default:
        return throwError(error);
    }
  }

  getAll(): Observable<any> {
    return this.http
      .get(endpoint + 's', this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getById(id: any): Observable<any> {
    return this.http
      .get(endpoint + '/' + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  insert(data: any): Observable<any> {
    return this.http
      .post<any>(endpoint, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  delete(id: any): Observable<any> {
    return this.http
      .delete(endpoint + '/' + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  update(id: any, data: any): Observable<any> {
    return this.http
      .put(endpoint + '/' + id, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
