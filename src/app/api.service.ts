import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ApiService {
  public changeNode: any;

  private endPoint = 'http://ec2-34-205-75-200.compute-1.amazonaws.com:3000/api';

  constructor(private http: Http) { }

  public sendNode(node): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${this.endPoint}/sendNode`,
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
      `${this.endPoint}/editNode`,
      JSON.stringify(node),
      options)
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw('Unable to connect to server'));
  }

  public deleteNode(id): Observable<any> {
    return this.http.get(`${this.endPoint}/deleteNode/${id}`)
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw('Unable to connect to server'));
  }

  public getTree(): Observable<any> {
    return this.http.get(`${this.endPoint}/getTree`)
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw('Unable to connect to server'));
  }

}
