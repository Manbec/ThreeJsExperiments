import * as THREE from 'three';
import {SceneSubject} from './scene.subject';

export class Lights extends SceneSubject {

  constructor(scene: THREE.Scene) {
    super(scene);

    const pointLight = new THREE.PointLight(0xffffff, 1, 4000);
    pointLight.position.set(50, 0, 0);

    const supportPointLight = new THREE.PointLight(0xffffff, 1, 4000);
    supportPointLight.position.set(-100, 800, 800);

    const lightAmbient = new THREE.AmbientLight(0x404040);
    scene.add(pointLight, supportPointLight, lightAmbient);

  }

  public update(elapsedTime: number): void {

  }

}
