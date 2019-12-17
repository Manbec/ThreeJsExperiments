import * as THREE from 'three';
import {SceneSubject} from '../../scene-subjects/scene.subject';
import {PlayerAndCameraPositionManager} from '../../starhead.camera-player-position-manager.component';
import {GameConstants} from '../../services/game-state-management.service';
import {AcceleratorControl} from './accelerator.control';
import {GameStateModel} from '../game-state/models/game-state.model';

export class PolarControls extends SceneSubject {

  playerAndCameraPositionManager: PlayerAndCameraPositionManager;
  gameConstants: GameConstants;
  gameState: GameStateModel;

  W = 87;
  A = 65;
  S = 83;
  D = 68;

  private left = false;
  private right = false;
  private upwards = false;
  private down = false;

  angleSpeed = .12;

  accelerationMax = 3;
  accelerationIncreaseStep = 0.14;
  accelerationDecreaseStep = 0.129;

  private horizontalAccelerator: AcceleratorControl;
  private verticalAccelerator: AcceleratorControl;
  private currentHorizontalPosition = 0;
  private currentVerticalPosition = 0;

  constructor(
    scene: THREE.Scene,
    playerAndCameraPositionManager: PlayerAndCameraPositionManager,
    gameConstants: GameConstants,
    gameState: GameStateModel
  ) {
    super(scene);

    this.playerAndCameraPositionManager = playerAndCameraPositionManager;
    this.gameConstants = gameConstants;
    this.gameState = gameState;

    this.horizontalAccelerator = new AcceleratorControl(
      this.angleSpeed, this.accelerationMax, this.accelerationIncreaseStep, this.accelerationDecreaseStep);

    this.verticalAccelerator = new AcceleratorControl(
      this.angleSpeed, this.accelerationMax, this.accelerationIncreaseStep, this.accelerationDecreaseStep);

  }


  onKeyDown = (keyCode) => {
    this.gameState.playerHasMoved = true;

    if (keyCode === this.A) {
      this.left = true;
    } else if (keyCode === this.D) {
      this.right = true;
    } else if (keyCode === this.W) {
      this.upwards = true;
    } else if (keyCode === this.S) {
      this.down = true;
    }

  }

  onKeyUp = (keyCode) => {
    if (keyCode === this.A) {
      this.left = false;
    } else if (keyCode === this.D) {
      this.right = false;
    } else if (keyCode === this.W) {
      this.upwards = false;
    } else if (keyCode === this.S) {
      this.down = false;
    }
  }

  update(time) {
    const horizontalDirection = this.left ? 1 : this.right ? -1 : 0;
    const verticalDirection = this.upwards ? -1 : this.down ? 1 : 0;

    this.horizontalAccelerator.increaseSpeedOf(this.gameConstants.speedStep);

    const horizontalAcceleration = this.horizontalAccelerator.getForce(horizontalDirection);
    const horizontalPosition = this.currentHorizontalPosition + horizontalAcceleration;
    if (horizontalPosition < this.gameConstants.playerMaxX && horizontalPosition > this.gameConstants.playerMinX) {
      this.currentHorizontalPosition = horizontalPosition;
    }

    const verticalAcceleration = this.verticalAccelerator.getForce(verticalDirection);
    const verticalPosition = this.currentVerticalPosition + verticalAcceleration;
    if (verticalPosition < this.gameConstants.playerMaxY && verticalPosition > this.gameConstants.playerMinY) {
      this.currentVerticalPosition = verticalPosition;
    }

    this.playerAndCameraPositionManager.setPosition(this.currentHorizontalPosition, this.currentVerticalPosition);

    this.playerAndCameraPositionManager.setAcceleration(
      Math.max( Math.abs(horizontalAcceleration * 100) / 2, Math.abs(verticalAcceleration) )
    );
    this.playerAndCameraPositionManager.setAngleDirection(verticalDirection * -1, horizontalDirection * -1);

  }

}
