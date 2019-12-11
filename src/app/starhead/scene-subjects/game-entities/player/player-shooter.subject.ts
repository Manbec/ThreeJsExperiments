import {ShooterComponentSubject} from '../shooter.subject';
import {Scene, Vector3} from 'three';
import {Bullet} from './bullet.subject';
import {GameConstants} from '../../../services/game-state-management.service';

export class PlayerShooter extends ShooterComponentSubject {

  bullets: Bullet[] = [];
  bulletsCache: Bullet[] = [];

  currentTime = 0;
  shootDelay = .06;
  lastShootTime = 0;

  bulletsColor = '#FFF';
  private gameConstants: GameConstants;
  private scene: Scene;

  constructor(scene: Scene, gameConstants: GameConstants) {
    super(scene);
    this.scene = scene;
    this.gameConstants = gameConstants;
    this.bullets = [];
  }

  public update(elapsedTime: number): void {
    this.currentTime = elapsedTime;
    for (let i = 0; i < this.bullets.length; i++) {
      const expired = this.bullets[i].update(elapsedTime);

      if (expired) {
        this.removeBullet(i);
      }
    }
  }

  shoot(originPosition: Vector3) {
    if (this.currentTime - this.lastShootTime < this.shootDelay) {
      return;
    }

    const bullet = this.bulletsCache.length !== 0 ? this.bulletsCache.pop().reset(originPosition) :
      new Bullet(this.scene, originPosition, this.gameConstants, this.bulletsColor);
    this.bullets.push(bullet);

    this.lastShootTime = this.currentTime;
  }

  removeBullet(i) {
    const bullet = this.bullets.splice(i, 1)[0];
    this.bulletsCache.push(bullet);
  }

}
