import * as THREE from 'three';
import {GameConstants, GameState, GameStateManagementService} from './services/game-state-management.service';
import {SceneSubject} from './scene-subjects/scene.subject';
import {Lights} from './scene-subjects/lights';
import {GameEntitiesManager} from './scene-subjects/game-entities.manager';
import {Player} from './scene-subjects/game-entities/player/player.subject';
import {Camera} from 'three';

export class PlayerAndCameraPositionManager {

  private canvas: HTMLCanvasElement;
  private clock: THREE.Clock;
  private screenDimensions: { width: number; height: number };
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private sceneSubjects: SceneSubject[];

  constructor(camera: Camera,
              player: Player,
              private gameConstants: GameConstants,
              gameState: GameState) {


  }

}
