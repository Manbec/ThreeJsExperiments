import * as THREE from 'three';
import {SceneSubject} from './scene.subject';
import {Scene, Vector3} from 'three';
import {Player} from './game-entities/player/player.subject';
import {PlayerShooter} from './game-entities/player/player-shooter.subject';
import {GameConstants, GameState} from '../services/game-state-management.service';

export class GameEntitiesManager extends SceneSubject {

  playerShooter: PlayerShooter;
  player: Player;
  walt;

  constructor(scene: Scene,
              gameConstants: GameConstants,
              gameState: GameState
              ) {
    super(scene);



  }

  public update(elapsedTime: number): void {

  }

}
