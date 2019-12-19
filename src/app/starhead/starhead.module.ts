import {NgModule} from '@angular/core';
import {StarheadComponent} from './starhead.component';
import {StarheadRoutingModule} from './starhead-routing.module';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {stateList} from './game/game-state/state-list';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    StarheadComponent,
  ],
  imports: [
    CommonModule,
    StarheadRoutingModule,
    NgxsModule.forRoot([...stateList]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ]
})
export class StarheadModule {}
