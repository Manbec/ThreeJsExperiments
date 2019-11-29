import * as THREE from 'three';
import {GameConstants, GameState} from './services/game-state-management.service';
import {Player} from './scene-subjects/game-entities/player/player.subject';
import {Camera} from 'three';
import {cos, polarToCartesian, sin} from './starhead.utils';
import TWEEN from '@tweenjs/tween.js';
import {angularLifecycleInterfaceKeys} from 'codelyzer/util/utils';

export class PlayerAndCameraPositionManager {

  camera: Camera;
  player: Player;
  gameState: GameState;

  cameraHeightFromPlayer = { value: .6, offset: 0 };
  playerDistanceFromCamera = 1.4;

  heightLevel = 0;
  lastAngleDirection = 0;
  lastRadiusDirection = 0;

  acceleration = 0;

  cameraLookAt = new THREE.Vector3(0, 100, 0);

  private cameraPolarPostion: { angle: number; y: number; radius: number };
  private playerPolarPostion: { angle: number; y: any; radius: number };

  cameraAngleStearingOffset = { val: 0 };

  constructor(camera: Camera,
              player: Player,
              private gameConstants: GameConstants,
              gameState: GameState) {

    this.camera = camera;
    this.player = player;
    this.gameState = gameState;

    this.cameraPolarPostion = {
      radius: 0,
      angle: 0,
      y: this.cameraHeightFromPlayer.value
    };

    this.playerPolarPostion = {
      radius: 0,
      angle: 0,
      y: gameConstants.baseLevelHeight
    };

  }

  public update(time) {

    if (!this.camera || !this.player || !this.player.playerMesh) {
      return;
    }

    this.player.playerMesh.position.set(sin(time / 2) / 40,  sin(time * 2) / 20, sin(time) / 40);

    // camera static movement
    this.cameraPolarPostion.radius += sin(time) / 10;
    this.cameraPolarPostion.angle += cos(time) / 8000;

    this.cameraPolarPostion.y = this.cameraHeightFromPlayer.value + cos(time / 2) / 16 + this.cameraHeightFromPlayer.offset;

    // camera acceleration movement
    const acc = this.acceleration >=  0.975 ? 1 / 2 : this.acceleration / 2;
    this.cameraPolarPostion.radius += sin(acc) * 2;
    this.cameraPolarPostion.y += sin(acc) / 1.5;

    this.cameraPolarPostion.angle += this.cameraAngleStearingOffset.val;

    this.updateCameraPosition();
    this.updatePlayerPosition();
  }

  updateCameraPosition() {
    if (!this.camera) {
      return;
    }
    const newPolarPositionCamera = polarToCartesian(this.cameraPolarPostion.radius, this.cameraPolarPostion.angle);

    this.camera.position.set(newPolarPositionCamera.x, this.playerPolarPostion.y + this.cameraPolarPostion.y, newPolarPositionCamera.y);

    this.camera.lookAt(this.cameraLookAt);
  }

  updatePlayerPosition() {
    const newPolarPositionPlayer = polarToCartesian(this.playerPolarPostion.radius, this.playerPolarPostion.angle);
    this.player.position.x = newPolarPositionPlayer.x;
    this.player.position.z = newPolarPositionPlayer.y;

    this.player.position.y = this.playerPolarPostion.y;

    this.player.rotation.y = -this.playerPolarPostion.angle;

    this.gameState.playerPosition = this.player.position;
  }

  setAcceleration(a) {
    this.player.acceleration = a;
    this.acceleration = a;
  }

  setPosition(radius, angle) {
    console.log(radius, angularLifecycleInterfaceKeys);
    this.cameraPolarPostion.radius = radius;
    this.cameraPolarPostion.angle = angle;

    this.playerPolarPostion.radius = radius - this.playerDistanceFromCamera;
    this.playerPolarPostion.angle = angle;
  }

  setAngleDirection(direction) {

    if (direction === this.lastAngleDirection) {
      return;
    }
    this.lastAngleDirection = direction;

    const tween = new TWEEN.Tween(this.player.playerMesh.rotation)
      .to({ x: direction * Math.PI / 8 }, 1000)
      .easing( TWEEN.Easing.Sinusoidal.InOut )
      .start();

    const tween2 = new TWEEN.Tween(this.cameraAngleStearingOffset)
      .to({ val: -direction / 400 }, 1000)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();

  }

  setRadiusDirection(direction) {
    if (direction === this.lastRadiusDirection) {
      return;
    }
    this.lastRadiusDirection = direction;

    const tween = new TWEEN.Tween(this.player.playerMesh.rotation)
      .to({ z: direction * Math.PI / 8 }, 600)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();

  }

  changeHeightLevel(newHeightLevel) {
    this.heightLevel = newHeightLevel;

    const tween = new TWEEN.Tween(this.playerPolarPostion)
      .to({ y: this.gameConstants.baseLevelHeight }, 400)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

  }

}
