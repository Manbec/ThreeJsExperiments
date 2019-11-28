import * as THREE from 'three';
import {SceneSubject} from '../../scene.subject';
import {GameState} from '../../../services/game-state-management.service';
import {PlayerShooter} from './player-shooter.subject';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {group} from '@angular/animations';
import {Euler, Group, Vector3} from 'three';

export class Player extends SceneSubject {

  private group: Group;
  private position: Vector3;
  private rotation: Euler;
  private acceleration: number;
  private shooting: boolean;
  private recoveringFromDamage: boolean;
  private gameState: GameState;
  private playerShooter: PlayerShooter;
  private playerMesh: Group;

  constructor(scene: THREE.Scene, gameState: GameState, playerShooter: PlayerShooter) {
    super(scene);

    this.gameState = gameState;
    this.playerShooter = playerShooter;

    this.group = new Group();
    scene.add( this.group );

    this.loadPlayerMesh();

    this.position = this.group.position;
    this.rotation = this.group.rotation;

    this.acceleration = 0;
    this.shooting = false;

    this.recoveringFromDamage = false;

  }

  public update(elapsedTime: number): void {

    if (this.shooting === true) {
      this.shoot();
    }

    // this.fadeMesh(time);

  }

  takeDamage() {

    if (this.recoveringFromDamage) {
      return;
    }

    // eventBus.post(decreaseLife);

    this.recoveringFromDamage = true;
    setTimeout(() => this.recoveringFromDamage = false, 3000);

  }

  loadPlayerMesh() {
    const loader = new OBJLoader();
    loader.load('assets/3Dmodels/silver-hawk-next/source/shawk13.obj.obj',  (player) => {

      this.group.add(player);

      const playerPointLight = new THREE.PointLight( '#F1F1F1', .3, 20);
      playerPointLight.position.set( 1, 1, 0 );
      this.group.add( playerPointLight );

      this.playerMesh = player;

    });
  }

  fadeMesh(time: number) {
    const opacity = this.recoveringFromDamage ?
      ( Math.sin(time * 16) + 1.2 ) / 2.2 : 1;

    // for (let i = 0; i< self.materials.length; i++) {
    //   this..materials[i].opacity = opacity
    // }

  }

  shoot() {
    this.playerShooter.shoot( new THREE.Vector3(this.group.position.x, this.group.position.y - 1, this.group.position.z) );
  }

  setShooting(shooting: boolean) {
    this.shooting = shooting;
  }

}
