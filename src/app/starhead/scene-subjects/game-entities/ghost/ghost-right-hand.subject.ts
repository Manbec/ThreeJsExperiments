import * as THREE from 'three';
import {SceneSubject} from '../../scene.subject';
import {Bullet} from '../player/bullet.subject';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {AnimationAction, Material, Scene, SkinnedMesh, Vector3} from 'three';
import {Object3D} from 'three';
import {AnimationMixer} from 'three';
import {_Math} from 'three/src/math/Math';
import degToRad = _Math.degToRad;
import TWEEN from '@tweenjs/tween.js';
import {AnimationClip} from 'three';

export class GhostRightHand extends SceneSubject {

  bullets: Bullet[] = [];
  private scene: Scene;
  public ghostRightHand: any;
  private ghostGroup: Object3D;
  private ghostRightHandAnimationMixer: AnimationMixer;
  public boundingSphereRad = 200;

  private handMeshMaterial: Material;

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
  private stretchHandInterval: NodeJS.Timeout;
  private activeAnimationAction: AnimationAction;
  private clips: AnimationClip[];

  constructor(scene: THREE.Scene) {
    super(scene);
    this.scene = scene;
    console.log('constructor right hand');
    this.createGhostRightHand();
  }

  public update(elapsedTime: number): void {

    if (this.ghostRightHandAnimationMixer) {
      this.ghostRightHandAnimationMixer.update(this.activeAnimationSpeed);
    }

  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  private createGhostRightHand() {

    this.ghostGroup = new THREE.Object3D();
    const loader = new FBXLoader();

    console.log('create right hand');
    loader.load('assets/3Dmodels/ghosthand.fbx', (object) => {

      object.position.x = -400;
      object.position.y = 1000;
      object.position.z = 0;
      object.rotation.x = - Math.PI * 1.5;
      object.rotation.z = degToRad(10);
      object.scale.x = object.scale.y = object.scale.z = 2.5;

      this.ghostRightHand = object;
      this.handMeshMaterial = this. ghostRightHand.children[1].material;

      this.handMeshMaterial.transparent = true;
      this.handMeshMaterial.opacity = 0.0;

      this.ghostRightHand.boundingSphereRad = this.boundingSphereRad;
      this.ghostGroup.add(this.ghostRightHand);

      this.scene.add(this.ghostRightHand);

      this.ghostRightHandAnimationMixer = new THREE.AnimationMixer( this.ghostRightHand );
      this.clips = this.ghostRightHand.animations;
      console.log('R Hand clips', this.clips);
      const clip = THREE.AnimationClip.findByName( this.clips, this.ghostHandAnimations.idle.title );
      this.activeAnimationSpeed = this.ghostHandAnimations.idle.speed;
      console.log(' hand clip', clip);
      this.activeAnimationAction = this.ghostRightHandAnimationMixer.clipAction( clip );
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

    const tweenAppearPath = new TWEEN.Tween(this.ghostRightHand.position)
      .to({
        x: -400,
        y: 800,
      }, 3000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  }

  floaty() {
    const tweenAppearPath = new TWEEN.Tween(this.ghostRightHand.position)
      .to({
        z: 50,
      }, 3000)
      .repeat( Infinity )
      .yoyo( true )
      .delay( 0 )
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    this.stretchHandInterval = setInterval(() => {
      this.stretchHand();
    }, 20000);
  }

  stretchHand() {
    const clip = AnimationClip.findByName(this.clips, this.ghostHandAnimations.idle2.title);
    this.activeAnimationAction = this.ghostRightHandAnimationMixer.clipAction( clip );
    this.activeAnimationSpeed = this.ghostHandAnimations.idle2.speed;
    this.activeAnimationAction.play();
    setTimeout(() => {
      this.activeAnimationAction.stop();
      const clipIdle = AnimationClip.findByName(this.clips, this.ghostHandAnimations.idle.title);
      this.activeAnimationAction = this.ghostRightHandAnimationMixer.clipAction( clipIdle );
      this.activeAnimationSpeed = this.ghostHandAnimations.idle.speed;
      this.activeAnimationAction.play();
    }, 2600);
  }

  receiveHit() {

  }

}
