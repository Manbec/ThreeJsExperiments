import * as THREE from 'three';
import {SceneSubject} from './scene.subject';
import {Scene, Vector3} from 'three';
import {Player} from './game-entities/player/player.subject';
import {PlayerShooter} from './game-entities/player/player-shooter.subject';
import {GameConstants, GameState} from '../services/game-state-management.service';
import {WaltHead} from './game-entities/walt/walt-head.subject';
import {WaltLeftHand} from './game-entities/walt/walt-left-hand.subject';
import {WaltRightHand} from './game-entities/walt/walt-right-hand.subject';

export class GameEntitiesManager extends SceneSubject {

  playerShooter: PlayerShooter;
  player: Player;
  waltHead: WaltHead;
  waltLeftHand: WaltLeftHand;
  waltRightHand: WaltRightHand;

  public gameStarted = false;

  constructor(scene: Scene,
              gameConstants: GameConstants,
              gameState: GameState
              ) {
    super(scene);

    this.playerShooter = new PlayerShooter(scene);
    this.player = new Player(scene, gameState, this.playerShooter);
    this.waltHead = new WaltHead(scene);
    this.waltLeftHand = new WaltLeftHand(scene);
    this.waltRightHand = new WaltRightHand(scene);

  }

  public update(elapsedTime: number): void {

    this.player.update(elapsedTime);
    // this.walt.update(elapsedTime);
    this.playerShooter.update(elapsedTime);

    if (!this.gameStarted) {
      return;
    }

    const playerBullets = this.playerShooter.bullets;

    const enemyBullets = [
      ...this.waltHead.getBullets(),
      ...this.waltLeftHand.getBullets(),
      ...this.waltRightHand.getBullets()
    ];

    this.checkCollisionWithTargets(playerBullets, [this.waltHead, this.waltRightHand, this.waltLeftHand]);
    this.checkCollisionWithPlayer(enemyBullets, this.player);

  }

  checkCollisionWithTargets(playerBullets, targets) {
    for (let i = 0; i < playerBullets.length; i++) {
      const bullet = playerBullets[i];

      for (let j = 0; j < targets.length; j++) {
        const target = targets[j];

        if (target.collision === true) {
          continue;
        }

        const distance = bullet.position.distanceTo( target.position );
        if (distance < target.boundingSphereRad) {
          bullet.collision = true;
          target.collision = true;

          // eventBus.post(increaseScore);
        }
      }
    }
  }

  checkCollisionWithPlayer(array1: SceneSubject[], player) {
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