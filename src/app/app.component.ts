import { Component, OnInit } from '@angular/core';
import { MainService } from "./main.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PinDialogComponent } from "./pin-dialog/pin-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public title = 'twShow';
  public sideNavOpened: boolean = false;
  private mainTwitterToken: string = '';
  public showTwitterConnectionError: boolean = false;
  public errorMessage: string = "Something went wrong with the connection to Twitter.";
  public showPinPrompt: boolean = false;
  public twitterPin: number;
  public twitterUsers: Array<any> = [];

  constructor(
    private mainService: MainService,
    public dialog: MatDialog
  ) { }

  ngOnInit() { }

  public toggleSideNav(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }


  private openPinPrompt(token: string): void {
    const dialogRef = this.dialog.open(PinDialogComponent, {
      width: '40vw',
      data: {
        title: 'Twitter token',
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
        this.mainTwitterToken = response.data;
        this.showPinPrompt = true;
        this.openPinPrompt(response.data);
      }
    })
  }

  public confirmPin(): void {
     this.mainService.confirmPin(this.twitterPin, this.mainTwitterToken).subscribe((response) => {
       this.twitterUsers.push(response.data);
     })
  }

  public getTweets(): void{
    this.mainService.getTweets(this.twitterUsers[0]).subscribe((response) => {
      console.log(response);
    })
  }
}
