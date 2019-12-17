import {SceneSubject} from '../../scene-subjects/scene.subject';
import {PlayerAndCameraPositionManager} from '../../starhead.camera-player-position-manager.component';
import {Player} from '../../scene-subjects/game-entities/player/player.subject';
import {GameStateModel} from '../game-state/models/game-state.model';
import {Scene} from 'three';

export class MouseControls extends SceneSubject {

  gameStarted = false;

  shoot = false;

  private player: Player;
  private playerAndCameraPositionManager: PlayerAndCameraPositionManager;

  constructor(scene: Scene,
              gameState: GameStateModel,
              playerAndCameraPositionManager: PlayerAndCameraPositionManager,
              player: Player) {
    super(scene);
    this.playerAndCameraPositionManager = playerAndCameraPositionManager;
    this.player = player;

    // eventBus.subscribe(gameOverEvent, onLeftClickUp );

  }

  public update(elapsedTime: number): void {

  }

  onMouseDown(event) {
    switch (event.which) {
      case 1:
        this.onLeftClickDown();
        break;
      case 2:
        // Middle Mouse button pressed
        break;
      case 3:
        this.onRightClick();
        break;
      default:
        console.error('unknown mouse button');
    }
  }

  onMouseUp(event) {
    switch (event.which) {
      case 1:
        this.onLeftClickUp();
        break;
      case 2:
        // Middle Mouse button pressed
        break;
      case 3:
        break;
      default:
        console.error('unknown mouse button');
    }
  }

  onRightClick() {
    // shoot special ammo
  }

  onLeftClickDown() {
    this.player.setShooting(true);
  }

  onLeftClickUp() {
    this.player.setShooting(false);
  }

}
