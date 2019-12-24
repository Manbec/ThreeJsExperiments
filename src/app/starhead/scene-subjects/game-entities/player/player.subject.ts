import {SceneSubject} from '../../scene.subject';
import {PlayerShooter} from './player-shooter.subject';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {Camera, Euler, Group, PointLight, Scene, Vector3} from 'three';
import {toRad} from '../../../starhead.utils';
import {BulletRaycastWall} from './bullet-raycast-wall.subject';
import {GameStateModel} from '../../../game/game-state/models/game-state.model';

export class Player extends SceneSubject {

  private group: Group;
  acceleration: number;
  shooting: boolean;
  recoveringFromDamage: boolean;
  gameState: GameStateModel;
  playerShooter: PlayerShooter;
  playerMesh: Group;
  public rotation: Euler;
  public position: Vector3;

  public initialXRotDegrees = 90;
  public initialYRotDegrees = 180;
  public initialZRotDegrees = 0;

  bulletAimWall: BulletRaycastWall;

  constructor(scene: Scene, gameState: GameStateModel,
              playerShooter: PlayerShooter, camera: Camera) {
    super(scene);

    this.gameState = gameState;
    this.playerShooter = playerShooter;

    this.group = new Group();
    scene.add( this.group );

    this.loadPlayerMesh();
    this.bulletAimWall = new BulletRaycastWall(scene, camera);

    this.position = this.group.position;
    this.rotation = this.group.rotation;
    this.position.z = -2;

    this.bulletAimWall.setPosition(this.position.x, this.position.y + 1100, this.position.z);

    this.acceleration = 0;
    this.shooting = false;

    this.recoveringFromDamage = false;

  }

  public update(elapsedTime: number): void {

    if (this.shooting === true) {
      this.shoot(this.bulletAimWall.raycastWallIntersectionLocation);
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

      const scale = .1;
      player.scale.set(scale, scale, scale);

      this.group.add(player);

      const playerPointLight = new PointLight( '#F1F1F1', .3, 20);
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

  shoot(destinationPosition: Vector3) {

    if (!this.gameState.gameStarted) {
      return;
    }
    const originPosition = new Vector3(this.playerMesh.position.x, this.playerMesh.position.y + 5.5, this.playerMesh.position.z - 2);
    this.playerShooter.shoot(originPosition, destinationPosition);
  }

  setShooting(shooting: boolean) {
    this.shooting = shooting;
  }

  onWindowResize(width: number, height: number) {
    this.bulletAimWall.onWindowResize(width, height);
  }

}
