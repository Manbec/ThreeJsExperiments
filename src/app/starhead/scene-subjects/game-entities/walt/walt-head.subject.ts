import {SceneSubject} from '../../scene.subject';
import {Bullet} from '../player/bullet.subject';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {AnimationClip, AnimationMixer, Group, Object3D, Scene} from 'three';

export class WaltHead extends SceneSubject {

  bullets: Bullet[] = [];
  private scene: Scene;
  private waltHead: any;
  private waltGroup: Object3D;
  private waltAnimationMixer: AnimationMixer;

  constructor(scene: Scene) {
    super(scene);
    this.scene = scene;
    this.createWaltHead();
  }

  public update(elapsedTime: number): void {

    if (this.waltAnimationMixer) {
      this.waltAnimationMixer.update(elapsedTime);
    }

  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  private createWaltHead() {

    // create a group container
    this.waltGroup = new Object3D();

    // load model and clone it
    const loader = new FBXLoader();

    loader.load('assets/3Dmodels/walthead.fbx', (object) => {

      object.position.x = 0;
      object.position.y = 800;
      object.position.z = 0;
      object.rotation.x = - Math.PI * 1.5;
      object.scale.x = object.scale.y = object.scale.z = 0.07;

      this.waltHead = object;
      this.waltGroup.add(this.waltHead);

      this.scene.add(this.waltHead);

      this.waltAnimationMixer = new AnimationMixer( this.waltHead );
      const clips = this.waltHead.animations;
      console.log('Walt clips', clips);
      const clip = AnimationClip.findByName( clips, 'Armature|Laugh' );
      console.log('walt clip', clip);
      const action = this.waltAnimationMixer.clipAction( clip );
      setTimeout(() => {
        action.play();
      }, 1000);

    });
  }

}
