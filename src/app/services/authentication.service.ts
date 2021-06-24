import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiURL = 'http://localhost:3000/api/v1/auth';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'x-access-token': '',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  auth(data: any): Observable<any> {
    return this.http.post(apiURL, data, httpOptions);
  }
}
