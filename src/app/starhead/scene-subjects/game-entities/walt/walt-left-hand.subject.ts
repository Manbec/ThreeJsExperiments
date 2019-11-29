import * as THREE from 'three';
import {SceneSubject} from '../../scene.subject';
import {Bullet} from '../player/bullet.subject';

export class WaltLeftHand extends SceneSubject {

  bullets: Bullet[] = [];

  constructor(scene: THREE.Scene) {
    super(scene);
  }

  public update(elapsedTime: number): void {

  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

}
