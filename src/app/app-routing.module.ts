import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {Threebeginners1Component} from './threebeginners1/threebeginners1.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'three1', component: Threebeginners1Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
