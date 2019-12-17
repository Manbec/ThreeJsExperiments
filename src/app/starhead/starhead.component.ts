import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SceneManager} from './starhead.scene-manager.component';
import {GameStateManagementService} from './services/game-state-management.service';
import TWEEN from '@tweenjs/tween.js';
import {GameState} from './game/game-state/game.state';
import {Select, Store} from '@ngxs/store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {SetGameStarted} from './game/game-state/actions/game.actions';

@Component({
  selector: 'threejslab-star-head',
  templateUrl: './starhead.component.html',
  styleUrls: ['./starhead.component.scss']
})
export class StarheadComponent implements OnInit, AfterViewInit, OnDestroy {

  @Select(GameState.isGameStarted)
  public gameStateStarted$: Observable<boolean>;

  @ViewChild('gameCanvasEl', { static: false }) gameCanvasEl: ElementRef;
  @ViewChild('aim', { static: false }) aim: ElementRef;
  private canvas: HTMLCanvasElement;
  private sceneManager: SceneManager;
  private gameSubscription: Subscription;

  constructor(private gameStateManagementService: GameStateManagementService,
              private store: Store) {

  }

  ngOnInit(): void {
    this.subscribeToGameStateChanges();
  }

  ngAfterViewInit(): void {

    this.canvas = this.gameCanvasEl.nativeElement as HTMLCanvasElement;

    if (!this.canvas) {
      console.error('Could not rertieve scene canvas');
      return;
    }

    document.body.style.overflow = 'hidden';

    this.sceneManager = new SceneManager(this.canvas, this.gameStateManagementService);

    this.bindEventListeners();
    this.gameLoop();

  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

  bindEventListeners() {
    window.onresize = this.resizeCanvas;
    window.onkeydown = this.onKeyDown;
    window.onkeyup = this.onKeyUp;
    window.onmousedown = this.onMouseDown;
    window.onmouseup = this.onMouseUp;
    window.onmousemove = this.onMouseMove;
    this.resizeCanvas();
  }

  resizeCanvas = () => {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.sceneManager.onWindowResize();
  }

  onKeyDown = (event) => {
    this.store.dispatch(new SetGameStarted(true));
    this.sceneManager.onKeyDown(event.keyCode);
  }

  onKeyUp = (event) => {
    this.sceneManager.onKeyUp(event.keyCode);
  }

  onMouseDown = (event) => {
    this.sceneManager.onMouseDown(event);
  }

  onMouseUp = (event) => {
    this.sceneManager.onMouseUp(event);
  }

  onMouseMove = (event) => {
    const x = event.clientX - 56; // 50px width of square plus borders widths
    const y = event.clientY - 56; // 50px width of square plus borders widths

    if (!x || !y) {
      return;
    }

    this.aim.nativeElement.style.setProperty('--x', `${x}px`);
    this.aim.nativeElement.style.setProperty('--y', `${y}px`);
  }

  gameLoop = (time = 0) => {
    requestAnimationFrame(this.gameLoop);
    TWEEN.update(time);
    this.sceneManager.update();
  }

  /** update the state of buttons and results on store changes */
  private subscribeToGameStateChanges(): void {
    this.gameSubscription = combineLatest(this.gameStateStarted$).subscribe(([gameStarted]) => {
      this.gameStateManagementService.gameState.gameStarted = gameStarted;
    });
  }

}
