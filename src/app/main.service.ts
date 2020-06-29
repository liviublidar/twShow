import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable()
export class MainService {

  private apiMap: any = {
    'http://localhost:4200/': 'http://127.0.0.1:8000/',
    'https://twbackbone.tk/': 'https://api.twbackbone.tk/'
  }

  public twitterUsers = [];

  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService
  ) {
    this.setTwitterUsers();
  }

  private getApiUrl(): string {
    return this.apiMap[window.location.href];
  }

  public getAppOauthToken(): Observable<any> {
    let url: string = this.getApiUrl() + 'tw';
    return this.http.get(url);
  }

  public confirmPin(pin: number, mainTwitterToken: string): Observable<any> {
    let body = {
      'pin': pin,
      'mainToken': mainTwitterToken
    };
    let url: string = this.getApiUrl() +'tw/connect';
    return this.http.post(url, body);
  }

  public getTweets(user: any): Observable<any> {
    let url: string = this.getApiUrl() + 'tw/tweets';
    return this.http.post(url, user);
  }

  public addTwitterUser(user: any) {
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
  }

  public getSelectedTwitterUser(): any {
    for(const user of this.twitterUsers){
      if(user.selected){
        return user;
      }
    }
  }

  public likeTweet(tweetId: number): Observable<any> {
    let body = {
      'tweetId': tweetId,
      'userValues': this.getSelectedTwitterUser()
    };
    let url: string = this.getApiUrl() +'tw/like';
    return this.http.post(url, body);
  }
}
