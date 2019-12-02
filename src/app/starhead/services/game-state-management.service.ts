import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface GameState {
  playerHasMoved: boolean;
  enableUserInput: boolean;
  health: number;
  playerPosition: THREE.Vector3;
}

export interface GameConstants {
  speedStep: number;
  baseLevelHeight: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameStateManagementService {

  private initialHealth = 100;

  gameConstants: GameConstants = {
    speedStep: 0,
    baseLevelHeight: 85,
  };

  gameState: GameState;

  constructor() {

    this.gameState = {
      playerPosition: new THREE.Vector3(0, 0, 0),
      health: this.initialHealth,
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
