import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ApiService {
  public changeNode: any;

  constructor(private http: Http) { }

  public sendNode(node): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      'http://localhost:3000/api/sendNode',
      JSON.stringify(node),
      options)
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw('Unable to connect to server'));
  }

  public editNode(node): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      'http://localhost:3000/api/editNode',
      JSON.stringify(node),
      options)
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw('Unable to connect to server'));
  }

  public deleteNode(id): Observable<any> {
    return this.http.get(`http://localhost:3000/api/deleteNode/${id}`)
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw('Unable to connect to server'));
  }

  public getTree(): Observable<any> {
    return this.http.get('http://localhost:3000/api/getTree')
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw('Unable to connect to server'));
  }

}
