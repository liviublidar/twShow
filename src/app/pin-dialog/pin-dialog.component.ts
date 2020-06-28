import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MainService } from "../main.service";

@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss']
})
export class PinDialogComponent {
  public gotTokens:boolean = false;
  public twitterPin: number;

  constructor(
    public dialogRef: MatDialogRef<PinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private mainService: MainService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  public confirmPin(): void {
    this.mainService.confirmPin(this.twitterPin, this.data.token).subscribe((response) => {
      this.twitterUsers.push(response.data);
    })
  }

}
