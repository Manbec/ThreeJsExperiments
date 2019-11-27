import * as THREE from 'three';
import {Scene} from 'three';

export abstract class SceneSubject {

  constructor(scene: Scene) {

  }

  public abstract update(elapsedTime: number): void;

}
