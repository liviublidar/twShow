import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class MainService {

  constructor(
    private http: HttpClient
  ) { }


  public getAppOauthToken(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/tw');
  }

  public confirmPin(pin: number, mainTwitterToken: string): Observable<any> {
    let body = {
      'pin': pin,
      'mainToken': mainTwitterToken
    };

    return this.http.post('http://127.0.0.1:8000/tw/connect', body);
  }

  public getTweets(user: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/tw/tweets', user);
  }
}
