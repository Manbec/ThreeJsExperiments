import * as THREE from 'three';
import {SceneSubject} from './scene.subject';
import {Scene, Vector3} from 'three';
import {Player} from './game-entities/player/player.subject';
import {PlayerShooter} from './game-entities/player/player-shooter.subject';

export class GameEntitiesManager extends SceneSubject {

  playerShooter: PlayerShooter;
  player: Player;
  walt;

  constructor(scene: Scene,
              gameConstants: { speedStep: number },
              gameState: { playerHasMoved: boolean; enableUserInput: boolean; health: number; playerPosition: Vector3 }
              ) {
    super(scene);



  }

  public update(elapsedTime: number): void {

  }

}
