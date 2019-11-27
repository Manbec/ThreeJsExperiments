import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SceneManager} from './starhead.scene-manager.component';
import {GameStateManagementService} from './services/game-state-management.service';

@Component({
  selector: 'threejslab-star-head',
  templateUrl: './starhead.component.html',
  styleUrls: ['./starhead.component.css']
})
export class StarheadComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gameCanvasEl', { static: true }) gameCanvasEl: ElementRef;
  private canvas: HTMLCanvasElement;
  private sceneManager: SceneManager;

  constructor(private gameStateManagementService: GameStateManagementService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.canvas = this.gameCanvasEl.nativeElement as HTMLCanvasElement;

    if (this.canvas) {
      console.error('Could not rertieve scene canvas');
      return;
    }

    this.sceneManager = new SceneManager(this.canvas, this.gameStateManagementService);

    this.bindEventListeners();
    this.gameLoop();

  }

  ngOnDestroy(): void {

  }

  bindEventListeners() {
    window.onresize = this.resizeCanvas;
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.sceneManager.onWindowResize();
  }

  gameLoop = () => {
    requestAnimationFrame(this.gameLoop);
    this.sceneManager.update();
  }

}
