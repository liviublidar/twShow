import { Component, OnInit } from '@angular/core';
import { MainService } from "./main.service";
import { MatDialog } from '@angular/material/dialog';
import { PinDialogComponent } from "./pin-dialog/pin-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  private interval: any;
  private intervalStarted = false;
  private refreshEvery: number = 20000; //milliseconds
  private refreshTicks: number = 0;
  private tickEvery: number = 650 //milliseconds
  public title = 'twShow';
  public sideNavOpened: boolean = false;
  public showTwitterConnectionError: boolean = false;
  public showPinPrompt: boolean = false;
  public tweets: Array<any> = [];
  public percentToRefresh: number = 0;


  constructor(
    private mainService: MainService,
    public dialog: MatDialog
  ) { }

  ngOnInit() { }

  private startInterval(): void {
    this.interval = setInterval(() => {
      this.handleRefresh();
    }, this.tickEvery);

    this.intervalStarted = true;
  }

  private stopInterval(): void {
    clearInterval(this.interval);
    this.intervalStarted = false;
  }

  private startOrReloadInterval(): void {
    this.stopInterval();
    this.startInterval();
  }

  private handleRefresh(): void {
    this.refreshTicks += this.tickEvery;
    let newPercent = Math.round((this.refreshTicks / (this.refreshEvery)) * 100);
    this.percentToRefresh = newPercent;

    if(this.refreshTicks >= this.refreshEvery) {
      this.getTweets();
      this.refreshTicks = 0;
    }
  }

  public toggleSideNav(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }

  private openPinPrompt(token: string): void {
    const dialogRef = this.dialog.open(PinDialogComponent, {
      width: '40vw',
      data: {
        title: 'Twitter PIN',
        token: token
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  public connectTwitter(): void {
    this.mainService.getAppOauthToken().subscribe((response) => {
      if (response.data < 1) {
        this.showTwitterConnectionError = true;
      } else {
        let url: string = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + response.data;
        window.open(url, "_blank");
        this.showPinPrompt = true;
        this.openPinPrompt(response.data);
      }
    })
  }

  public getTweets(): void {
    this.mainService.getTweets(this.mainService.getSelectedTwitterUser()).subscribe((response) => {
      this.tweets = response.data;
      console.log(this.tweets);
    })

    this.startOrReloadInterval()

  }

  public getAllTwitterUsers(): Array<any> {
    return this.mainService.twitterUsers;
  }

  public selectTwitterUser(user: any): void {
    this.mainService.selectTwitterUser(user.user_id);
  }

  public likeTweet(tweetId: number): void {
    this.mainService.likeTweet(tweetId).subscribe( response => {
      console.log(response);
    })
  }

}
