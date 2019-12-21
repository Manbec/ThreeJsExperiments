import * as THREE from 'three';
import {ShooterComponentSubject} from '../shooter.subject';

export class GhostHandShooter extends ShooterComponentSubject {

  constructor(scene: THREE.Scene) {
    super(scene);
  }

  public update(elapsedTime: number): void {

  }

}
