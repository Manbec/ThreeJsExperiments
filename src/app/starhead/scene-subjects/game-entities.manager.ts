import {SceneSubject} from './scene.subject';
import {Camera, Scene} from 'three';
import {Player} from './game-entities/player/player.subject';
import {PlayerShooter} from './game-entities/player/player-shooter.subject';
import {GameConstants} from '../services/game-state-management.service';
import {GhostHead} from './game-entities/ghost/ghost-head.subject';
import {GhostLeftHand} from './game-entities/ghost/ghost-left-hand.subject';
import {GhostRightHand} from './game-entities/ghost/ghost-right-hand.subject';
import {GameStateModel} from '../game/game-state/models/game-state.model';

export class GameEntitiesManager extends SceneSubject {

  playerShooter: PlayerShooter;
  player: Player;
  ghostHead: GhostHead;
  ghostLeftHand: GhostLeftHand;
  ghostRightHand: GhostRightHand;
  gameState: GameStateModel;

  constructor(scene: Scene,
              camera: Camera,
              gameConstants: GameConstants,
              gameState: GameStateModel) {
    super(scene);

    this.playerShooter = new PlayerShooter(scene, gameConstants);
    this.player = new Player(scene, gameState, this.playerShooter, camera);
    this.ghostHead = new GhostHead(scene, gameState);
    this.ghostLeftHand = new GhostLeftHand(scene, gameState);
    this.ghostRightHand = new GhostRightHand(scene, gameState);
    this.gameState = gameState;

  }

  public update(elapsedTime: number): void {

    this.player.update(elapsedTime);
    // this.ghost.update(elapsedTime);
    this.playerShooter.update(elapsedTime);
    this.ghostHead.update(elapsedTime);
    this.ghostLeftHand.update(elapsedTime);
    this.ghostRightHand.update(elapsedTime);

    if (!this.gameState.gameStarted) {
      return;
    }

    const playerBullets = this.playerShooter.bullets;

    const enemyBullets = [
      ...this.ghostHead.getBullets(),
      ...this.ghostLeftHand.getBullets(),
      ...this.ghostRightHand.getBullets()
    ];

    this.checkCollisionWithTargets(playerBullets, [
      {
        mesh: this.ghostHead.ghostHead,
        subject: this.ghostHead
      },
      {
        mesh: this.ghostRightHand.ghostRightHand,
        subject: this.ghostRightHand
      },
      {
        mesh: this.ghostLeftHand.ghostLeftHand,
        subject: this.ghostLeftHand
      }
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

        const distance = bullet.position.distanceTo( target.mesh.position );
        // console.log('distant bullet to target ', j, ' ', target, ' = ', distance, '. For radius ', target, target.boundingSphereRad);
        if (distance < target.mesh.boundingSphereRad) {
          console.log('HIT!!!!!', j);
          // bullet.collision = true;
          console.log(target);
          target.subject.receiveHit();

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
