import * as THREE from 'three';
import {SceneSubject} from '../../scene-subjects/scene.subject';
import {PlayerAndCameraPositionManager} from '../../starhead.camera-player-position-manager.component';
import {GameConstants, GameState} from '../../services/game-state-management.service';
import {AcceleratorControl} from './accelerator.control';

export class PolarControls extends SceneSubject {

  playerAndCameraPositionManager: PlayerAndCameraPositionManager;
  gameConstants: GameConstants;
  gameState: GameState;

  W = 87;
  A = 65;
  S = 83;
  D = 68;

  private left = false;
  private right = false;
  private upwards = false;
  private down = false;

  angleSpeed = 0.02;
  radSpeed = 1;

  acceletationMax = 1;
  accelerationIncreaseStep = 0.02;
  accelerationDecreaseStep = 0.009;

  currentAngle = 0;
  private angleAccelerator: AcceleratorControl;
  private radAccelerator: AcceleratorControl;

  constructor(
    scene: THREE.Scene,
    playerAndCameraPositionManager: PlayerAndCameraPositionManager,
    gameConstants: GameConstants,
    gameState: GameState
  ) {
    super(scene);

    this.playerAndCameraPositionManager = playerAndCameraPositionManager;
    this.gameConstants = gameConstants;
    this.gameState = gameState;

    this.angleAccelerator = new AcceleratorControl(
      this.angleSpeed, this.acceletationMax, this.accelerationIncreaseStep, this.accelerationDecreaseStep);

    this.radAccelerator = new AcceleratorControl(
      this.angleSpeed, this.acceletationMax, this.accelerationIncreaseStep, this.accelerationDecreaseStep);

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
    const angleDirection = this.left ? 1 : this.right ? -1 : 0;
    const radDirection = this.upwards ? -1 : this.down ? 1 : 0;

    this.angleAccelerator.increaseSpeedOf(this.gameConstants.speedStep);

    const angleAcceleration = this.angleAccelerator.getForce(angleDirection);
    this.currentAngle += angleAcceleration;

    const radAcceleration = this.radAccelerator.getForce(radDirection);
    // const tRad = currentRadius + radAcceleration;
    // if (tRad > this.gameConstants.minRadius && tRad < this.gameConstants.maxRadius {
    //   currentRadius = tRad;
   //  }

    this.playerAndCameraPositionManager.setPosition(200, this.currentAngle);

    this.playerAndCameraPositionManager.setAcceleration( Math.max( Math.abs(angleAcceleration * 100) / 2, Math.abs(radAcceleration) ) );

    this.playerAndCameraPositionManager.setAngleDirection(angleDirection);
    this.playerAndCameraPositionManager.setRadiusDirection(radDirection * - 1);

  }

}
