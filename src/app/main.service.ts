import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable()
export class MainService {

  public twitterUsers;

  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService
  ) {
    this.setTwitterUsers();
  }


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

  public addTwitterUser(user: any, callback?) {
    this.dbService.add('twUsers', user).then(
      null,
      error => {
        console.log(error);
      }
    );
  }

  public setTwitterUsers(): void {
    this.dbService.getAll('twUsers').then(
      twUsers => {
        this.twitterUsers = twUsers
      },
      error => {
        console.log(error);
      }
    );
  }
}
