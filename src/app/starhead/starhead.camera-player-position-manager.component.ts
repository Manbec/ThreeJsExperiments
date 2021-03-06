import * as THREE from 'three';
import {GameConstants} from './services/game-state-management.service';
import {Player} from './scene-subjects/game-entities/player/player.subject';
import {Camera} from 'three';
import {cos, sin, toRad} from './starhead.utils';
import TWEEN from '@tweenjs/tween.js';
import {GameStateModel} from './game/game-state/models/game-state.model';
import {Store} from '@ngxs/store';
import {SetPlayerPosition} from './game/game-state/actions/game.actions';

export class PlayerAndCameraPositionManager {

  camera: Camera;
  player: Player;
  gameState: GameStateModel;

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
  private store: Store;

  constructor(camera: Camera,
              player: Player,
              private gameConstants: GameConstants,
              gameState: GameStateModel,
              store: Store) {

    this.camera = camera;
    this.player = player;
    this.gameState = gameState;
    this.store = store;

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
    this.store.dispatch(new SetPlayerPosition(this.player.playerMesh.position));

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

  onWindowResize(width: number, height: number) {
    this.player.onWindowResize(width, height);
  }

}
