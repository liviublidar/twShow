import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MainService } from "./main.service";
import { HttpClientModule } from "@angular/common/http";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { PinDialogComponent } from './pin-dialog/pin-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import {MatRadioModule} from "@angular/material/radio";
import {MatProgressBarModule} from "@angular/material/progress-bar";

export function migrationFactory() {
  return {
    1: (db, transaction) => {
      transaction.objectStore('twUsers');
    }
  };
}

const dbConfig: DBConfig  = {
  name: 'twShowDb',
  version: 1,
  objectStoresMeta: [{
    store: 'twUsers',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'oauth_token', keypath: 'oauth_token', options: { unique: true } },
      { name: 'user_id', keypath: 'user_id', options: { unique: true } },
      { name: 'screen_name', keypath: 'screen_name', options: { unique: true } },
      { name: 'oauth_token_secret', keypath: 'oauth_token_secret', options: { unique: true } },
    ]
  }],
  migrationFactory
};

@NgModule({
  declarations: [
    AppComponent,
    PinDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSliderModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    MatRadioModule,
    MatProgressBarModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
