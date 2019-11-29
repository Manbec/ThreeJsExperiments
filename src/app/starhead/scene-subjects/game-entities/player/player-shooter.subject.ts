import * as THREE from 'three';
import {ShooterComponentSubject} from '../shooter.subject';
import {Vector3} from 'three';
import {Bullet} from './bullet.subject';

export class PlayerShooter extends ShooterComponentSubject {

  bullets: Bullet[];

  constructor(scene: THREE.Scene) {
    super(scene);
    this.bullets = [];
  }

  public update(elapsedTime: number): void {

  }

  shoot(vector3: Vector3) {

  }
}
