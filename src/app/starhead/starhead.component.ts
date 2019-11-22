import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SceneManager} from './starhead.scene-manager.component';

@Component({
  selector: 'threejslab-star-head',
  templateUrl: './starhead.component.html',
  styleUrls: ['./starhead.component.css']
})
export class StarheadComponent implements OnInit, AfterViewInit, OnDestroy {

  private canvas: HTMLCanvasElement;
  private sceneManager: SceneManager;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (this.canvas) {
      console.error('Could not rertieve scene canvas');
      return;
    }

    this.sceneManager = new SceneManager(this.canvas);

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
