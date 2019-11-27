import * as THREE from 'three';
import {ShooterComponentSubject} from '../shooter.subject';

export class WaltHeadShooter extends ShooterComponentSubject {

  constructor(scene: THREE.Scene) {
    super(scene);
  }

  public update(elapsedTime: number): void {

  }

}
