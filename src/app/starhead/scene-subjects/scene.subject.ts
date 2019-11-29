import * as THREE from 'three';
import {Object3D, Scene} from 'three';

export abstract class SceneSubject extends Object3D {

  boundingSphereRad: number;
  collision = false;

  protected constructor(scene: Scene) {
    super();
  }

  public abstract update(elapsedTime: number): void;

}
