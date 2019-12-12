import * as THREE from 'three';
import {SceneSubject} from '../../scene.subject';
import {Bullet} from '../player/bullet.subject';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {Scene} from 'three';
import {Object3D} from 'three';
import {AnimationMixer} from 'three';
import {_Math} from 'three/src/math/Math';
import degToRad = _Math.degToRad;

export class WaltLeftHand extends SceneSubject {

  bullets: Bullet[] = [];
  private scene: Scene;
  private waltLeftHand: any;
  private waltGroup: Object3D;
  private waltLeftHandAnimationMixer: AnimationMixer;

  constructor(scene: THREE.Scene) {
    super(scene);
    this.scene = scene;
    this.createWaltLeftHand();
  }

  public update(elapsedTime: number): void {

    if (this.waltLeftHandAnimationMixer) {
      this.waltLeftHandAnimationMixer.update(elapsedTime);
    }

  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  private createWaltLeftHand() {

    this.waltGroup = new THREE.Object3D();
    const loader = new FBXLoader();

    loader.load('assets/3Dmodels/walthand.fbx', (object) => {

      object.position.x = 400;
      object.position.y = 800;
      object.position.z = 0;
      object.rotation.x = - Math.PI * 1.5;
      object.rotation.z = -degToRad(45);
      object.scale.x = object.scale.y = object.scale.z = 2.5;
      object.scale.x = -2;

      this.waltLeftHand = object;
      this.waltGroup.add(this.waltLeftHand);

      this.scene.add(this.waltLeftHand);


      this.waltLeftHandAnimationMixer = new THREE.AnimationMixer( this.waltLeftHand );
      const clips = this.waltLeftHand.animations;
      console.log('L Hand clips', clips);
      const clip = THREE.AnimationClip.findByName( clips, 'Armature|idle' );
      console.log('L hand clip', clip);
      const action = this.waltLeftHandAnimationMixer.clipAction( clip );
      setTimeout(() => {
        action.play();
      }, 1000);

    });

  }

}
