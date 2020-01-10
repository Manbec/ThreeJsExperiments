import * as THREE from 'three';
import {SceneSubject} from '../../scene.subject';
import {Bullet} from '../player/bullet.subject';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {AnimationAction, Material, Scene} from 'three';
import {Object3D} from 'three';
import {AnimationMixer} from 'three';
import {_Math} from 'three/src/math/Math';
import degToRad = _Math.degToRad;
import TWEEN from '@tweenjs/tween.js';
import {AnimationClip} from 'three';
import {Vector3} from 'three';
import {GameStateModel} from '../../../game/game-state/models/game-state.model';
import radToDeg = _Math.radToDeg;

export class GhostLeftHand extends SceneSubject {

  private scene: Scene;
  public ghostLeftHand: any;
  private ghostGroup: Object3D;
  private ghostLeftHandAnimationMixer: AnimationMixer;
  public boundingSphereRad = 200;

  private activeAnimationSpeed: number;
  ghostHandAnimations = {
    idle:  {
      title: 'Armature|idle',
      speed: 0.05
    },
    idle2: {
      title: 'Armature|idle2',
      speed: 0.02
    },
    newHand: {
      title: 'Armature|New',
      speed: 0.02
    },
    shoot: {
      title: 'Armature|Shoot',
      speed: 0.08
    }
  };
  private handMeshMaterial: Material;
  private stretchHandInterval: NodeJS.Timeout;
  private clips: AnimationClip[];
  private activeAnimationAction: AnimationAction;
  private shootInterval: NodeJS.Timeout;
  private gameState: GameStateModel;
  private bullet: Bullet;
  bulletsColor = '#FF0000';
  private shooting: boolean;

  constructor(scene: THREE.Scene, gameState: GameStateModel) {
    super(scene);
    this.scene = scene;
    this.gameState = gameState;
    this.createGhostLeftHand();
  }

  public update(elapsedTime: number): void {

    if (this.ghostLeftHandAnimationMixer) {
      this.ghostLeftHandAnimationMixer.update(this.activeAnimationSpeed);
    }

    if (this.bullet) {
      this.bullet.update(elapsedTime);
    }

  }

  public getBullets(): Bullet[] {
    const bullets = [];

    if (this.bullet) {
      bullets.push(this.bullet);
    }

    return bullets;
  }

  private createGhostLeftHand() {

    this.ghostGroup = new THREE.Object3D();
    const loader = new FBXLoader();

    loader.load('assets/3Dmodels/ghosthand.fbx', (object) => {

      object.position.x = 400;
      object.position.y = 1000;
      object.position.z = 0;
      object.rotation.x = - Math.PI * 1.5;
      object.rotation.z = -degToRad(10);
      object.scale.x = object.scale.y = object.scale.z = 2.5;
      object.scale.x = -2;

      this.ghostLeftHand = object;
      this.ghostLeftHand.boundingSphereRad = this.boundingSphereRad;
      this.handMeshMaterial = this.ghostLeftHand.children[1].material;
      this.ghostGroup.add(this.ghostLeftHand);

      this.handMeshMaterial.transparent = true;
      this.handMeshMaterial.opacity = 0.0;

      this.scene.add(this.ghostLeftHand);


      this.ghostLeftHandAnimationMixer = new THREE.AnimationMixer( this.ghostLeftHand );
      this.clips = this.ghostLeftHand.animations;
      console.log('L Hand clips', this.clips);
      const clip = THREE.AnimationClip.findByName( this.clips, this.ghostHandAnimations.idle.title );
      this.activeAnimationSpeed = this.ghostHandAnimations.idle.speed;
      console.log('L hand clip', clip);
      this.activeAnimationAction = this.ghostLeftHandAnimationMixer.clipAction( clip );
      setTimeout(() => {
        this.activeAnimationAction.play();
        this.appear();
        this.floaty();
        this.beginShooting();
      }, 1000);


      const originPosition = new Vector3(
        this.ghostLeftHand.position.x,
        this.ghostLeftHand.position.y + 5.5,
        this.ghostLeftHand.position.z - 2);
      const destinationPosition = new Vector3(
        this.gameState.playerPosition.x,
        this.gameState.playerPosition.y + 5.5,
        this.gameState.playerPosition.z - 2);

      this.bullet = new Bullet(this.scene, originPosition, destinationPosition, this.bulletsColor, 170);

    });

  }

  appear() {

    const tweenOpacityAppearPath = new TWEEN.Tween(this.handMeshMaterial)
      .to({
        opacity: 1.0
      }, 3000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    const tweenAppearPath = new TWEEN.Tween(this.ghostLeftHand.position)
      .to({
        x: 400,
        y: 800,
        z: 0,
      }, 3000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  }

  floaty() {
    const tweenAppearPath = new TWEEN.Tween(this.ghostLeftHand.position)
      .to({
        z: -40,
      }, 3000)
      .repeat( Infinity )
      .yoyo(true)
      .delay( 300 )
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    this.stretchHandInterval = setInterval(() => {
      this.stretchHand();
    }, 26000);
  }

  beginShooting() {
    this.shootInterval = setInterval(() => {
      this.shoot();
    }, 2000);
  }

  shoot() {
    if (this.shooting || !this.gameState.gameStarted) {
      return;
    }
    this.shooting = true;
    const shootClip = AnimationClip.findByName(this.clips, this.ghostHandAnimations.shoot.title);
    this.activeAnimationAction = this.ghostLeftHandAnimationMixer.clipAction( shootClip );
    this.activeAnimationSpeed = this.ghostHandAnimations.idle2.speed;
    this.activeAnimationAction.play();

    // backup original rotation
    const startRotation = new THREE.Euler().copy( this.ghostLeftHand.rotation );
    // final rotation (with lookAt)
    this.ghostLeftHand.lookAt( this.gameState.playerPosition );
    const endRotation = new THREE.Euler().copy( this.ghostLeftHand.rotation );

    // revert to original rotation
    this.ghostLeftHand.rotation.copy( startRotation );

    console.log(radToDeg(startRotation.x), radToDeg(endRotation.x));
    console.log(radToDeg(startRotation.y), radToDeg(endRotation.y));

    // Tween
    new TWEEN.Tween( this.ghostLeftHand.rotation ).to( {
      x: endRotation.x,
      y: endRotation.y,
      z: endRotation.z - degToRad(120)
    }, 600 ).start();

    setTimeout(() => {
      this.ghostLeftHand.rotation.z = this.ghostLeftHand.rotation.z - degToRad(120);
    });

    setTimeout(() => {
      this.activeAnimationAction.stop();
      const clipIdle = AnimationClip.findByName(this.clips, this.ghostHandAnimations.idle.title);
      this.activeAnimationAction = this.ghostLeftHandAnimationMixer.clipAction( clipIdle );
      this.activeAnimationSpeed = this.ghostHandAnimations.idle.speed;
      this.activeAnimationAction.play();
      this.shooting = false;

      // console.log("AJAKAA", radToDeg(this.ghostLeftHand.rotation.x), radToDeg(Math.PI * 1.5));
      // return;
      const resetHandTween = new TWEEN.Tween(this.ghostLeftHand.rotation)
        .to({
          x: - degToRad(90),
          y: 0,
          z: -degToRad(10)
        }, 500)
        .start();

    }, 3000);

    setTimeout(() => {
      const originPosition = new Vector3(
        this.ghostLeftHand.position.x,
        this.ghostLeftHand.position.y + 5.5,
        this.ghostLeftHand.position.z - 2);
      const destinationPosition = new Vector3(
        this.gameState.playerPosition.x,
        this.gameState.playerPosition.y,
        this.gameState.playerPosition.z - 2);
      this.bullet.reset(originPosition, destinationPosition);
    }, 400);

  }

  stretchHand() {
    if (this.shooting) {
      return;
    }
    const clip = AnimationClip.findByName(this.clips, this.ghostHandAnimations.idle2.title);
    this.activeAnimationAction = this.ghostLeftHandAnimationMixer.clipAction( clip );
    this.activeAnimationSpeed = this.ghostHandAnimations.idle2.speed;
    this.activeAnimationAction.play();
    setTimeout(() => {
      this.activeAnimationAction.stop();
      const clipIdle = AnimationClip.findByName(this.clips, this.ghostHandAnimations.idle.title);
      this.activeAnimationAction = this.ghostLeftHandAnimationMixer.clipAction( clipIdle );
      this.activeAnimationSpeed = this.ghostHandAnimations.idle.speed;
      this.activeAnimationAction.play();
    }, 2600);
  }

  receiveHit() {

  }

}
