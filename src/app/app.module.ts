import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { Threebeginners1Component } from './threebeginners1/threebeginners1.component';
import { Threebeginners2Component } from './threebeginners2/threebeginners2.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    Threebeginners1Component,
    Threebeginners2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
