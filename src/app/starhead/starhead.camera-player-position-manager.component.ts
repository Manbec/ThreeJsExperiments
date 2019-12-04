import * as THREE from 'three';
import {GameConstants, GameState} from './services/game-state-management.service';
import {Player} from './scene-subjects/game-entities/player/player.subject';
import {Camera} from 'three';
import {cos, polarToCartesian, sin, toDeg, toRad} from './starhead.utils';
import TWEEN from '@tweenjs/tween.js';

export class PlayerAndCameraPositionManager {

  camera: Camera;
  player: Player;
  gameState: GameState;

  cameraHeightFromPlayer = { value: .6, offset: 0 };
  playerDistanceFromCamera = 320;

  heightLevel = 0;
  lastHorizontalAngleDirection = 0;
  lastVerticalAngleDirection = 0;

  acceleration = 0;

  cameraLookAt = new THREE.Vector3(0, 100, 0);

  private cameraPolarPosition: { angle: number; y: number; radius: number };
  private playerPolarPosition: { horizontalPosition: number; y: any; verticalPosition: number };

  cameraAngleStearingOffset = { val: 0 };

  constructor(camera: Camera,
              player: Player,
              private gameConstants: GameConstants,
              gameState: GameState) {

    this.camera = camera;
    this.player = player;
    this.gameState = gameState;

    this.cameraPolarPosition = {
      radius: 0,
      angle: 0,
      y: this.cameraHeightFromPlayer.value
    };

    this.playerPolarPosition = {
      verticalPosition: 0,
      horizontalPosition: 0,
      y: gameConstants.baseLevelHeight
    };

    const tweenCameraLookAt = new TWEEN.Tween(this.cameraLookAt)
      .to({ y: 0 }, 1500)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    console.log(this.cameraLookAt);
    const tweenCameraHeight = new TWEEN.Tween(this.cameraHeightFromPlayer)
      .to({ offset: 0 }, 1500)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  }

  public update(time) {

    // console.log(this.camera.position);
    // console.log(this.cameraLookAt);
    // console.log(this.player.playerMesh.position);
    if (!this.camera || !this.player || !this.player.playerMesh) {
      return;
    }

    this.player.playerMesh.position.set(sin(time * 4) / 10,  sin(time / 4) / 20, sin(time * 2) / 10);

    // camera static movement
    this.cameraPolarPosition.radius += sin(time) / 100;
    this.cameraPolarPosition.angle += cos(time) / 8000;

    this.cameraPolarPosition.y = this.cameraHeightFromPlayer.value + cos(time / 2) / 16 + this.cameraHeightFromPlayer.offset;

    // camera acceleration movement
    const acc = this.acceleration >=  0.975 ? 1 / 2 : this.acceleration / 2;
    this.cameraPolarPosition.radius += sin(acc) * 2;
    this.cameraPolarPosition.y += sin(acc) / 1.5;

    this.cameraPolarPosition.angle += this.cameraAngleStearingOffset.val;

    this.updateCameraPosition();
    this.updatePlayerPosition();
  }

  updateCameraPosition() {
    if (!this.camera) {
      return;
    }

    this.camera.position.set(0  , -20, 0);

    this.camera.lookAt(this.cameraLookAt);
  }

  updatePlayerPosition() {

    this.player.playerMesh.position.set(this.player.position.x - this.playerPolarPosition.horizontalPosition, this.player.position.y,
      this.player.position.z - this.playerPolarPosition.verticalPosition);
    this.gameState.playerPosition = this.player.position;

  }

  setAcceleration(a) {
    // console.log('acceleration ', a);
    this.player.acceleration = a;
    this.acceleration = a;
  }

  setPosition(horizontalPosition, verticalPosition) {
    this.playerPolarPosition.horizontalPosition = horizontalPosition;
    this.playerPolarPosition.verticalPosition = verticalPosition;
  }

  setAngleDirection(verticalDirection, horizontalDirection) {
    if (verticalDirection === this.lastVerticalAngleDirection &&
        horizontalDirection === this.lastHorizontalAngleDirection) {
      return;
    }

    this.lastVerticalAngleDirection = verticalDirection;
    this.lastHorizontalAngleDirection = horizontalDirection;

    const tweenHorizontalTilt = new TWEEN.Tween(this.player.playerMesh.rotation)
      .to({
        z: toRad(this.player.initialZRotDegrees) + horizontalDirection * Math.PI / 8,
      }, 1000)
      .easing( TWEEN.Easing.Sinusoidal.InOut )
      .start();

    const tweenVerticalTilt = new TWEEN.Tween(this.player.playerMesh.rotation)
      .to({
        x: toRad(this.player.initialXRotDegrees) + verticalDirection * Math.PI / 8
      }, 600)
      .easing( TWEEN.Easing.Cubic.InOut )
      .start();

    const tween2 = new TWEEN.Tween(this.cameraAngleStearingOffset)
      .to({ val: -verticalDirection / 400 }, 1000)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();

  }

  setRadiusDirection(direction) {
    if (direction === this.lastVerticalAngleDirection) {
      return;
    }
    this.lastVerticalAngleDirection = direction;

    const tween = new TWEEN.Tween(this.player.playerMesh.rotation)
      .to({ z: direction * Math.PI / 8 }, 600)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();

  }

  changeHeightLevel(newHeightLevel) {
    this.heightLevel = newHeightLevel;

    const tween = new TWEEN.Tween(this.playerPolarPosition)
      .to({ y: this.gameConstants.baseLevelHeight }, 400)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

  }

}
