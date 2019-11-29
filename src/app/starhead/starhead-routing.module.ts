import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StarheadComponent} from './starhead.component';

const routes: Routes = [
  { path: '', component: StarheadComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class StarheadRoutingModule { }
