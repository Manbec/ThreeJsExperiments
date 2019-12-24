/**
 *  This state is responsible for storing the overall game state
 */

import {defaultGhostInitalHealth, defaultInitalHealth, GameStateModel} from './models/game-state.model';
import {Vector3} from 'three';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {GameStateManagementService} from '../../services/game-state-management.service';
import {GetPlayerPosition, IsGameStarted, SetGameStarted, SetPlayerPosition} from './actions/game.actions';

/** default state */
const defaultGameState = (): GameStateModel => {
  return {
    gameStarted: false,
    playerPosition: new Vector3(0, 0, 0),
    playerHealth: defaultInitalHealth,
    ghostHealth: defaultGhostInitalHealth,
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

  @Selector()
  static playerPosition(state: GameStateModel): Vector3 {
    return state.playerPosition;
  }

  constructor(private gameStateManagementService: GameStateManagementService) { }

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


  @Action(GetPlayerPosition)
  getPlayerPosition({ getState, patchState }: StateContext<GameStateModel>) {
    const state: GameStateModel = getState();
    return state.gameStarted;
  }


  @Action(SetPlayerPosition)
  setPlayerPosition({ patchState }: StateContext<GameStateModel>, { playerPosition }: SetPlayerPosition) {
    patchState({
      playerPosition
    });
  }

}
