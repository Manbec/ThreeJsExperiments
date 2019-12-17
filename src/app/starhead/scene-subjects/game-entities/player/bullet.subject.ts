import {ShooterComponentSubject} from '../shooter.subject';
import {Color, Mesh, MeshBasicMaterial, Scene, SphereBufferGeometry, Vector3} from 'three';
import {getRandom} from '../../../starhead.utils';
import {GameConstants} from '../../../services/game-state-management.service';
import TWEEN from '@tweenjs/tween.js';

export class Bullet extends ShooterComponentSubject {

  speed = 2;

  geometryBulletPlayer = new SphereBufferGeometry( .4, 16, 16 );
  materialBulletPlayer = new MeshBasicMaterial();
  blueprintBulletPlayer: Mesh;
  private timeAlive: number;
  private position: Vector3;
  private readonly bulletMesh: Mesh;
  private scene: Scene;
  private readonly maxScaleX: number;
  private readonly maxScaleY: number;
  private readonly maxScaleZ: number;
  private gameConstants: GameConstants;

  constructor(scene: Scene,
              originPosition: Vector3, destinationPosition: Vector3,
              gameConstants: GameConstants, color: string) {
    super(scene);

    this.scene = scene;
    this.gameConstants = gameConstants;
    this.blueprintBulletPlayer  = new Mesh( this.geometryBulletPlayer, this.materialBulletPlayer );

    this.materialBulletPlayer.color = new Color(color);

    this.bulletMesh = this.blueprintBulletPlayer.clone();
    this.bulletMesh.position.set(originPosition.x, originPosition.y, originPosition.z);
    scene.add(this.bulletMesh);

    this.maxScaleX = getRandom(.5, 1.5);
    this.maxScaleY = getRandom(.5, 1.5);
    this.maxScaleZ = getRandom(.5, 1.5);
    this.bulletMesh.scale.set(this.maxScaleX, this.maxScaleY, this.maxScaleZ);

    this.timeAlive = 100;

    this.collision = false;
    this.position = this.bulletMesh.position;

    if (destinationPosition) {
      const tweenBulletPath = new TWEEN.Tween(this.bulletMesh.position)
        .to({
          x: destinationPosition.x,
          y: destinationPosition.y,
          z: destinationPosition.z,
        }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    }

  }


  public update(elapsedTime: number): boolean {

    this.timeAlive -= this.speed;

    // console.log(this.polarCoords);
    // this.bulletMesh.position.x = (this.polarCoords.radius) * cos(this.polarCoords.angle);
    // this.bulletMesh.position.z = (this.polarCoords.radius) * sin(this.polarCoords.angle);


    console.log('expired', this.timeAlive, this.collision);
    const expired = this.timeAlive < 0 || this.collision === true;
    if (expired && this.bulletMesh && this.scene) {
      this.scene.remove(this.bulletMesh);
    }

    return expired;

  }

  reset(newOrigin, destinationPosition: Vector3) {

    this.bulletMesh.position.set(newOrigin.x, newOrigin.y, newOrigin.z);
    this.timeAlive = 100;

    this.collision = false;

    this.scene.add(this.bulletMesh);

    const tweenBulletPath = new TWEEN.Tween(this.bulletMesh.position)
      .to({
        x: destinationPosition.x,
        y: destinationPosition.y,
        z: destinationPosition.z,
      }, 1500)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    return this;
  }

  updateScale(polarCoords) {
    const scaleX =  this.maxScaleX - ( polarCoords.radius / 200 ) * this.maxScaleX / 4;
    const scaleY =  this.maxScaleY - ( polarCoords.radius / 200 ) * this.maxScaleY / 4;
    const scaleZ =  this.maxScaleZ - ( polarCoords.radius / 200 ) * this.maxScaleZ / 4;
    this.bulletMesh.scale.set( scaleX, scaleY, scaleZ );
  }

}
