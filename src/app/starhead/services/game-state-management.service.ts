import { Injectable } from '@angular/core';
import {Vector3} from 'three';
import {defaultGhostInitalHealth, defaultInitalHealth, GameStateModel} from '../game/game-state/models/game-state.model';


export interface GameConstants {
  speedStep: number;
  baseLevelHeight: number;
  playerMaxY: number;
  playerMinY: number;
  playerMaxX: number;
  playerMinX: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameStateManagementService {

  public initialHealth = defaultInitalHealth;
  public ghostInitialHealth = defaultGhostInitalHealth;

  gameConstants: GameConstants = {
    speedStep: 0,
    baseLevelHeight: 25,
    playerMaxY: 10,
    playerMinY: -10,
    playerMaxX: 12,
    playerMinX: -12
  };

  gameState: GameStateModel;

  constructor() {

    this.gameState = {
      gameStarted: false,
      playerPosition: new Vector3(0, 0, 0),
      playerHealth: this.initialHealth,
      ghostHealth: this.ghostInitialHealth,
      playerHasMoved: false,
      enableUserInput: true
    };

    // NGXS goes here

    // eventBus.subscribe( introScreenClosed, () => this.gameState.enableUserInput = true )
    // eventBus.subscribe( startCountDownFinishedEvent, () => {
    //   this.gameConstants.speedStep = 0.0000008;
    // } )

    // eventBus.subscribe(gameOverEvent, () => {
    //   this.gameState.playerHeightLevel = 0
    //   this.gameState.lives = maxLives
    //   this.gameState.score = 0
    //   this.gameState.enableUserInput = false

    //   this.gameConstants.speedStep = 0
    // })

  }

  public update(time) {
  }

}
