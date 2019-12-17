import * as THREE from 'three';
import {SceneSubject} from '../../scene.subject';
import {Bullet} from '../player/bullet.subject';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {Scene} from 'three';
import {Object3D} from 'three';
import {AnimationMixer} from 'three';
import {_Math} from 'three/src/math/Math';
import degToRad = _Math.degToRad;

export class WaltRightHand extends SceneSubject {

  bullets: Bullet[] = [];
  private scene: Scene;
  public waltRightHand: any;
  private waltGroup: Object3D;
  private waltRightHandAnimationMixer: AnimationMixer;
  public boundingSphereRad = 200;

  constructor(scene: THREE.Scene) {
    super(scene);
    this.scene = scene;
    console.log('constructor right hand');
    this.createWaltRightHand();
  }

  public update(elapsedTime: number): void {

    if (this.waltRightHandAnimationMixer) {
      this.waltRightHandAnimationMixer.update(elapsedTime);
    }

  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  private createWaltRightHand() {

    this.waltGroup = new THREE.Object3D();
    const loader = new FBXLoader();

    console.log('create right hand');
    loader.load('assets/3Dmodels/walthand.fbx', (object) => {

      object.position.x = -400;
      object.position.y = 800;
      object.position.z = 0;
      object.rotation.x = - Math.PI * 1.5;
      object.rotation.z = degToRad(45);
      object.scale.x = object.scale.y = object.scale.z = 2.5;

      this.waltRightHand = object;
      this.waltRightHand.boundingSphereRad = this.boundingSphereRad;
      this.waltGroup.add(this.waltRightHand);

      this.scene.add(this.waltRightHand);

      this.waltRightHandAnimationMixer = new THREE.AnimationMixer( this.waltRightHand );
      const clips = this.waltRightHand.animations;
      console.log('L Hand clips', clips);
      const clip = THREE.AnimationClip.findByName( clips, 'Armature|idle' );
      console.log('L hand clip', clip);
      const action = this.waltRightHandAnimationMixer.clipAction( clip );
      setTimeout(() => {
        action.play();
      }, 1000);

    });


  }

}
