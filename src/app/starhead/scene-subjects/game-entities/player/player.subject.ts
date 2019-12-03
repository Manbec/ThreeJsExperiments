import * as THREE from 'three';
import {SceneSubject} from '../../scene.subject';
import {GameState} from '../../../services/game-state-management.service';
import {PlayerShooter} from './player-shooter.subject';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {group} from '@angular/animations';
import {Euler, Group, Vector3} from 'three';
import {toRad} from '../../../starhead.utils';

export class Player extends SceneSubject {

  private group: Group;
  acceleration: number;
  shooting: boolean;
  recoveringFromDamage: boolean;
  gameState: GameState;
  playerShooter: PlayerShooter;
  playerMesh: Group;
  public rotation: Euler;
  public position: Vector3;

  public initialXRotDegrees = 90;
  public initialYRotDegrees = 180;
  public initialZRotDegrees = 0;

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
    // loader.load('assets/3Dmodels/portrait/source/P1_7 DISP.OBJ',  (player) => {

      const scale = .2;
      player.scale.set(scale, scale, scale);

      this.group.add(player);

      const playerPointLight = new THREE.PointLight( '#F1F1F1', .3, 20);
      playerPointLight.position.set( 1, 1, 0 );
      this.group.add( playerPointLight );

      this.playerMesh = player;
      this.playerMesh.rotation.set(toRad(this.initialXRotDegrees), toRad(this.initialYRotDegrees), toRad(this.initialZRotDegrees));

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
