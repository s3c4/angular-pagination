import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {

  private getUrl = 'http://jsonplaceholder.typicode.com/photos';

  constructor(private http: HttpClient) {}
  // -->Create: an observable which return a json
  public getJson<T>(): Observable<T> {
    return this.http.get<T>(this.getUrl);
  }
}
