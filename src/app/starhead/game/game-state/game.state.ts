/**
 *  This state is responsible for storing the overall game state
 */

import {defaultInitalHealth, GameStateModel} from './models/game-state.model';
import {Vector3} from 'three';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {GameStateManagementService} from '../../services/game-state-management.service';
import {IsGameStarted, SetGameStarted} from './actions/game.actions';

/** default state */
const defaultGameState = (): GameStateModel => {
  return {
    gameStarted: false,
    playerPosition: new Vector3(0, 0, 0),
    health: defaultInitalHealth,
    playerHasMoved: false,
    enableUserInput: true
  };
};

@State<GameStateModel>({
  name: 'ordersState',
  defaults: defaultGameState()
})
export class GameState {

  @Selector()
  static isGameStarted(state: GameStateModel): boolean {
    return state.gameStarted;
  }

  constructor(private gameStateManagementService: GameStateManagementService) { }

  /** get the list of orders from api
   *  and convert it to frontend orders model
   */
  @Action(IsGameStarted)
  isGameStarted({ getState, patchState }: StateContext<GameStateModel>) {
    const state: GameStateModel = getState();
    return state.gameStarted;
  }

  @Action(SetGameStarted)
  setFilter({ patchState }: StateContext<GameStateModel>, { gameStarted }: SetGameStarted) {
    patchState({
      gameStarted
    });
  }

}
