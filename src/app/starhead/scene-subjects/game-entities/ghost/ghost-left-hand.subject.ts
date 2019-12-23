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

export class GhostLeftHand extends SceneSubject {

  bullets: Bullet[] = [];
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
      speed: 0.05
    }
  };
  private handMeshMaterial: Material;
  private stretchHandInterval: NodeJS.Timeout;
  private clips: AnimationClip[];
  private activeAnimationAction: AnimationAction;

  constructor(scene: THREE.Scene) {
    super(scene);
    this.scene = scene;
    this.createGhostLeftHand();
  }

  public update(elapsedTime: number): void {

    if (this.ghostLeftHandAnimationMixer) {
      this.ghostLeftHandAnimationMixer.update(this.activeAnimationSpeed);
    }

  }

  public getBullets(): Bullet[] {
    return this.bullets;
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
      }, 1000);

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

  stretchHand() {
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
