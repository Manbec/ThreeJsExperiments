import * as THREE from 'three';
import {Object3D, Scene} from 'three';

export abstract class SceneSubject {

  boundingSphereRad: number;
  collision = false;

  protected constructor(scene: Scene) {
  }

  public abstract update(elapsedTime: number): void;

}
