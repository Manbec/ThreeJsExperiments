import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SceneManager} from './starhead.scene-manager.component';
import {GameStateManagementService} from './services/game-state-management.service';
import TWEEN from '@tweenjs/tween.js';

@Component({
  selector: 'threejslab-star-head',
  templateUrl: './starhead.component.html',
  styleUrls: ['./starhead.component.scss']
})
export class StarheadComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gameCanvasEl', { static: false }) gameCanvasEl: ElementRef;
  @ViewChild('aim', { static: false }) aim: ElementRef;
  private canvas: HTMLCanvasElement;
  private sceneManager: SceneManager;

  constructor(private gameStateManagementService: GameStateManagementService) { }

  ngOnInit(): void {
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

}
