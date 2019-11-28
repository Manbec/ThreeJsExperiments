import * as THREE from 'three';
import {ShooterComponentSubject} from '../shooter.subject';
import {Vector3} from 'three';

export class PlayerShooter extends ShooterComponentSubject {

  constructor(scene: THREE.Scene) {
    super(scene);
  }

  public update(elapsedTime: number): void {

  }

  shoot(vector3: Vector3) {

  }
}
