import * as THREE from 'three';
import {GameStateManagementService} from './services/game-state-management.service';
import {SceneSubject} from './scene-subjects/scene.subject';
import {Lights} from './scene-subjects/lights';
import {GameEntitiesManager} from './scene-subjects/game-entities.manager';
import {PlayerAndCameraPositionManager} from './starhead.camera-player-position-manager.component';

export class SceneManager {

  private canvas: HTMLCanvasElement;
  private clock: THREE.Clock;
  private screenDimensions: { width: number; height: number };
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private sceneSubjects: SceneSubject[];

  /*
    Based on https://medium.com/@soffritti.pierfrancesco/how-to-organize-the-structure-of-a-three-js-project-77649f58fa3f
    Other links:
    https://medium.com/@soffritti.pierfrancesco/create-a-simple-event-bus-in-javascript-8aa0370b3969
    https://www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/
    http://devx.ddd.it/en/experiment/18/
    https://github.com/PierfrancescoSoffritti/doodles/tree/master/18_Monolith
   */
  private gameEntitiesManager: GameEntitiesManager;
  private playerAndCameraPositionManager: PlayerAndCameraPositionManager;

  constructor(canvas: HTMLCanvasElement, private gameStateManagementService: GameStateManagementService) {

    this.canvas = canvas;

    this.clock = new THREE.Clock();

    this.screenDimensions = {
      width: this.canvas.width,
      height: this.canvas.height
    };

    this.scene = this.buildScene();
    this.renderer = this.buildRender(this.screenDimensions);
    this.camera = this.buildCamera(this.screenDimensions);
    this.sceneSubjects = this.createSceneSubjects(this.scene, gameStateManagementService.gameConstants);

    // these should be SceneSubjects
    this.gameEntitiesManager = new GameEntitiesManager(this.scene, gameStateManagementService.gameConstants, gameStateManagementService.gameState);
    this.playerAndCameraPositionManager = new PlayerAndCameraPositionManager(
      this.camera,
      gameEntitiesManager.player,
      gameStateManagementService.gameConstants,
      gameStateManager.gameState
    );

    const controls = this.buildControls(this.playerAndCameraPositionManager, this.gameEntitiesManager.player, gameStateManagementService.gameConstants, gameStateManagementService.gameState)

  }

  buildScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000');

    return scene;
  }

  buildRender({ width, height }): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  buildCamera({ width, height }): THREE.PerspectiveCamera {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    return camera;
  }


  buildControls(playerAndCameraPositionManager, player, gameConstants, gameState) {
    const controls = {
      polar: new PolarControls(playerAndCameraPositionManager, gameConstants, gameState),
      mouse: new MouseControls(gameState, playerAndCameraPositionManager, player)
    };

    return controls;
  }

  createSceneSubjects(scene: THREE.Scene, gameConstants: { speedStep: number }) {
    const sceneSubjects: SceneSubject[] = [
      new Lights(scene),
      // new SceneSubject(scene)
    ];

    return sceneSubjects;
  }

  update(): void {

    const elapsedTime = this.clock.getElapsedTime();

    for (sceneSubject of this.sceneSubjects) {
      sceneSubject.update(elapsedTime);
    }

    this.renderer.render(this.scene, this.camera);

  }

  onWindowResize = (): void => {
    const { width, height } = this.canvas;

    this.screenDimensions.width = width;
    this.screenDimensions.height = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }


}
