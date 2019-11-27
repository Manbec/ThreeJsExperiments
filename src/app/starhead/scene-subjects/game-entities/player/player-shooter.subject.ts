import * as THREE from 'three';
import {ShooterComponentSubject} from '../shooter.subject';

export class PlayerShooter extends ShooterComponentSubject {

  constructor(scene: THREE.Scene) {
    super(scene);
  }

  public update(elapsedTime: number): void {

  }

}
