import * as THREE from 'three';
import {SceneSubject} from '../../scene-subjects/scene.subject';
import {PlayerAndCameraPositionManager} from '../../starhead.camera-player-position-manager.component';
import {GameConstants, GameState} from '../../services/game-state-management.service';

export class PolarControls extends SceneSubject {

  constructor(
    scene: THREE.Scene,
    playerAndCameraPositionManager: PlayerAndCameraPositionManager,
    gameConstants: GameConstants,
    gameState: GameState) {
    super(scene);
  }

  public update(elapsedTime: number): void {

  }

}
