import {GameStateManagementService} from './services/game-state-management.service';
import {SceneSubject} from './scene-subjects/scene.subject';
import {Lights} from './scene-subjects/lights';
import {GameEntitiesManager} from './scene-subjects/game-entities.manager';
import {PlayerAndCameraPositionManager} from './starhead.camera-player-position-manager.component';
import {MouseControls} from './game/controls/mouse.control';
import {PolarControls} from './game/controls/polar.control';
import {Nebula} from './scene-subjects/nebula';
import * as _ from 'lodash';
import {Clock, Color, PerspectiveCamera, Scene, WebGLRenderer} from 'three';

export class SceneManager {

  private canvas: HTMLCanvasElement;
  private clock: Clock;
  private screenDimensions: { width: number; height: number };
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
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
  private controls: { polar: PolarControls; mouse: MouseControls };

  constructor(canvas: HTMLCanvasElement, private gameStateManagementService: GameStateManagementService) {

    this.canvas = canvas;

    this.clock = new Clock();

    this.screenDimensions = {
      width: this.canvas.clientWidth,
      height: this.canvas.clientHeight
    };

    this.scene = this.buildScene();
    this.renderer = this.buildRender(this.screenDimensions);
    this.camera = this.buildCamera(this.screenDimensions);
    this.sceneSubjects = this.createSceneSubjects(this.scene, gameStateManagementService.gameConstants);

    // these should be SceneSubjects
    this.gameEntitiesManager = new GameEntitiesManager(
      this.scene,
      this.camera,
      gameStateManagementService.gameConstants,
      gameStateManagementService.gameState);
    this.playerAndCameraPositionManager = new PlayerAndCameraPositionManager(
      this.camera,
      this.gameEntitiesManager.player,
      gameStateManagementService.gameConstants,
      gameStateManagementService.gameState
    );

    this.controls = this.buildControls(
      this.playerAndCameraPositionManager,
      this.gameEntitiesManager.player,
      gameStateManagementService.gameConstants,
      gameStateManagementService.gameState
    );

  }

  buildScene(): Scene {
    const scene = new Scene();
    scene.background = new Color('#000');

    return scene;
  }

  buildRender({ width, height }): WebGLRenderer {
    const renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  buildCamera({ width, height }): PerspectiveCamera {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 1;
    const farPlane = 1400;
    const camera = new PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    return camera;
  }


  buildControls(playerAndCameraPositionManager, player, gameConstants, gameState): {polar: PolarControls, mouse: MouseControls} {
    const controls = {
      polar: new PolarControls(this.scene, playerAndCameraPositionManager, gameConstants, gameState),
      mouse: new MouseControls(this.scene, gameState, playerAndCameraPositionManager, player)
    };

    return controls;
  }

  createSceneSubjects(scene: Scene, gameConstants: { speedStep: number }) {
    const sceneSubjects: SceneSubject[] = [
      new Lights(scene),
      new Nebula(scene),
      // new SceneSubject(scene)
    ];

    return sceneSubjects;
  }

  update(): void {

    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = this.clock.getDelta();

    for (const subject of this.sceneSubjects) {
      subject.update(elapsedTime);
    }

    this.gameStateManagementService.update(elapsedTime);

    this.controls.polar.update(elapsedTime);
    this.controls.mouse.update(elapsedTime);

    this.playerAndCameraPositionManager.update(elapsedTime);
    this.gameEntitiesManager.update(elapsedTime);

    this.renderer.render(this.scene, this.camera);

  }

  onWindowResize = (): void => {
    const { width, height } = this.canvas;

    this.screenDimensions.width = width;
    this.screenDimensions.height = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.playerAndCameraPositionManager.onWindowResize(width, height);

  }


  onKeyDown(keyCode) {

    if (!this.gameStateManagementService.gameState.enableUserInput) {
      return;
    }

    // refactor. this is a hack
    if (keyCode === 32) {
      // space
      this.onMouseDown({ which: 3});
      return;
    } else if (keyCode === 77) {
      // m
      this.onMouseDown({ which: 1});
      return;
    }

    this.controls.polar.onKeyDown(keyCode);
  }

  onKeyUp(keyCode) {
    if (!this.gameStateManagementService.gameState.enableUserInput) {
      return;
    }

    // refactor. this is a hack
    if (keyCode === 32) {
      // space
      this.onMouseUp({ which: 3});
      return;
    } else if (keyCode === 77) {
      // m
      this.onMouseUp({ which: 1});
      return;
    }

    this.controls.polar.onKeyUp(keyCode);
  }

  onMouseDown(event) {
    if (!this.gameStateManagementService.gameState.enableUserInput) {
      return;
    }
    if (_.get(this, 'gameEntitiesManager.player.bulletAimWall', false)) {
      this.gameEntitiesManager.player.bulletAimWall.onMouseDown(event);
    }
    this.controls.mouse.onMouseDown(event);
  }

  onMouseUp(event) {
    if (!this.gameStateManagementService.gameState.enableUserInput) {
      return;
    }
    this.controls.mouse.onMouseUp(event);
  }

}
