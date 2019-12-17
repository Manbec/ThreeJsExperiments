import * as THREE from 'three';
import {SceneSubject} from './scene.subject';
import {Camera, Scene, Vector3} from 'three';
import {Player} from './game-entities/player/player.subject';
import {PlayerShooter} from './game-entities/player/player-shooter.subject';
import {GameConstants} from '../services/game-state-management.service';
import {WaltHead} from './game-entities/walt/walt-head.subject';
import {WaltLeftHand} from './game-entities/walt/walt-left-hand.subject';
import {WaltRightHand} from './game-entities/walt/walt-right-hand.subject';
import {GameStateModel} from '../game/game-state/models/game-state.model';

export class GameEntitiesManager extends SceneSubject {

  playerShooter: PlayerShooter;
  player: Player;
  waltHead: WaltHead;
  waltLeftHand: WaltLeftHand;
  waltRightHand: WaltRightHand;
  gameState: GameStateModel;

  constructor(scene: Scene,
              camera: Camera,
              gameConstants: GameConstants,
              gameState: GameStateModel
              ) {
    super(scene);

    this.playerShooter = new PlayerShooter(scene, gameConstants);
    this.player = new Player(scene, gameState, this.playerShooter, camera);
    this.waltHead = new WaltHead(scene);
    this.waltLeftHand = new WaltLeftHand(scene);
    this.waltRightHand = new WaltRightHand(scene);
    this.gameState = gameState;

  }

  public update(elapsedTime: number): void {

    this.player.update(elapsedTime);
    // this.walt.update(elapsedTime);
    this.playerShooter.update(elapsedTime);
    this.waltHead.update(elapsedTime);
    this.waltLeftHand.update(elapsedTime);
    this.waltRightHand.update(elapsedTime);

    if (!this.gameState.gameStarted) {
      return;
    }

    const playerBullets = this.playerShooter.bullets;

    const enemyBullets = [
      ...this.waltHead.getBullets(),
      ...this.waltLeftHand.getBullets(),
      ...this.waltRightHand.getBullets()
    ];

    this.checkCollisionWithTargets(playerBullets, [
      this.waltHead.waltHead,
      this.waltRightHand.waltRightHand,
      this.waltLeftHand.waltLeftHand
    ]);
    this.checkCollisionWithPlayer(enemyBullets, this.player);

  }

  checkCollisionWithTargets(playerBullets, targets) {
    // console.log(playerBullets, targets);
    for (let i = 0; i < playerBullets.length; i++) {
      const bullet = playerBullets[i];

      for (let j = 0; j < targets.length; j++) {
        const target = targets[j];
        // console.log(bullet.position, target.position);
        if (target.collision === true) {
          continue;
        }

        const distance = bullet.position.distanceTo( target.position );
        // console.log('distant bullet to target ', j, ' ', target, ' = ', distance, '. For radius ', target, target.boundingSphereRad);
        if (distance < target.boundingSphereRad) {
          // console.log("HIT!!!!!", j);
          bullet.collision = true;
          target.collision = true;

          // eventBus.post(increaseScore);
        }
      }
    }
  }

  checkCollisionWithPlayer(array1: any[], player) {
    for (let i = 0; i < array1.length; i++) {
      const el1 = array1[i];

      const distance = el1.position.distanceTo( player.position );
      if (distance < el1.boundingSphereRad) {
        el1.collision = true;

        player.takeDamage();
      }
    }
  }
}
