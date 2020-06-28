import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable()
export class MainService {

  public twitterUsers = [];

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
      success => {
        this.setTwitterUsers()
      },
      error => {
        console.log(error);
      }
    );
  }

  public setTwitterUsers(selectId?: number): void {
    this.dbService.getAll('twUsers').then(
      (twUsers: Array<any>) => {
        if(twUsers.length > 0){
          if(selectId) {
            twUsers.forEach( (item: any) =>{
              if(item.user_id === selectId) {
                item.selected = true;
              }
            })
          } else {
            twUsers[0].selected = true;
          }
        }

        this.twitterUsers = twUsers;
      },
      error => {
        console.log(error);
      }
    );
  }

  public selectTwitterUser(userId: number) {
    this.twitterUsers.forEach(user => {
      if(user.user_id == userId) {
        user.selected = true;
      } else {
        user.selected = false;
      }
    })
    console.log(this.twitterUsers)
  }

  public getSelectedTwitterUser(): any {
    for(const user of this.twitterUsers){
      if(user.selected){
        return user;
      }
    }
  }
}
