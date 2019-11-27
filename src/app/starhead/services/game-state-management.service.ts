import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class GameStateManagementService {

  private initialHealth = 100;

  gameConstants = {
    speedStep: 0,
  };

  gameState: {
    playerHasMoved: boolean;
    enableUserInput: boolean;
    health: number;
    playerPosition: THREE.Vector3
  };

  constructor() {

    this.gameState = {
      playerPosition: new THREE.Vector3(0, 0, 0),
      health: this.initialHealth,
      playerHasMoved: false,
      enableUserInput: false
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
