import * as THREE from 'three';
import {SceneSubject} from '../../scene-subjects/scene.subject';

export class AcceleratorControl {

  acceleration = 0;
  prevDirection = 0;
  private speed: number;
  private accelerationMax: number;
  private accelerationIncreaseStep: number;
  private accelerationDecreaseStep: number;
  private absAcc: number;

  constructor(speed: number, accelerationMax: number, accelerationIncreaseStep: number, accelerationDecreaseStep: number) {

    this.speed = speed;
    this.accelerationMax = accelerationMax;
    this.accelerationIncreaseStep = accelerationIncreaseStep;
    this.accelerationDecreaseStep = accelerationDecreaseStep;

  }

  getForce(direction) {
    this.updateAngleAcceleration(direction);
    this.prevDirection = direction;

    return this.speed * this.acceleration;
  }

  boost(factor) {
    this.acceleration *= factor;
  }

  increaseSpeedOf(increase) {
    this.speed += increase;
  }

  resetSpeed(baseSpeed) {
    this.speed = baseSpeed;
  }

   updateAngleAcceleration(direction) {
    this.absAcc = Math.abs(this.acceleration);

    if (direction === 0) {
      this.decelerate();
    } else {
      this.accelerate(direction);
    }

  }

  decelerate() {
    if (this.absAcc !== 0) {
      this.acceleration = Math.sign(this.acceleration) * (this.absAcc - this.accelerationDecreaseStep);
    }
    if (this.absAcc < 0.01) {
      this.acceleration = 0;
    }

    return 0;
  }

  accelerate(direction) {
    if (this.prevDirection !== direction) {
      this.decelerate();
    }
    if (this.absAcc < this.accelerationMax) {
      this.acceleration += direction * this.accelerationIncreaseStep;
    } else {
      this.decelerate();
    }

    return direction;
  }

}
