import * as THREE from 'three';
import {SceneSubject} from '../../scene-subjects/scene.subject';

export class AcceleratorControl extends SceneSubject {

  constructor(scene: THREE.Scene) {
    super(scene);
  }

  public update(elapsedTime: number): void {

  }

}
