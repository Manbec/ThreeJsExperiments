import {SceneSubject} from '../../scene.subject';
import {Bullet} from '../player/bullet.subject';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {AnimationAction, AnimationClip, AnimationMixer, Material, Object3D, Scene} from 'three';
import TWEEN from '@tweenjs/tween.js';
import {GameStateManagementService} from '../../../services/game-state-management.service';
import {GameStateModel} from '../../../game/game-state/models/game-state.model';

export class GhostHead extends SceneSubject {

  private scene: Scene;
  public ghostHead: any;
  private ghostGroup: Object3D;
  private ghostAnimationMixer: AnimationMixer;
  public boundingSphereRad = 200;

  private activeAnimationSpeed: number;
  ghostHeadAnimations = {
    angry:  {
      title: 'Armature|Angry',
      speed: 0.05
    },
    hit: {
      title: 'Armature|Ouch',
      speed: 0.02
    },
    idle: {
      title: 'Armature|Idle',
      speed: 0.02
    },
    laugh: {
      title: 'Armature|Laugh',
      speed: 0.05
    }
  };
  private headMeshMaterial: Material;
  private clips: AnimationClip[];
  private activeAnimationAction: AnimationAction;
  private gameState: GameStateModel;
  private receivingHit = false;
  private bullet: Bullet;
  bulletsColor = '#FF0000';
  private shooting: boolean;

  constructor(scene: Scene, gameState: GameStateModel) {
    super(scene);
    this.scene = scene;
    this.gameState = gameState;
    this.createGhostHead();
  }

  public update(elapsedTime: number): void {

    if (this.ghostAnimationMixer) {
      this.ghostAnimationMixer.update(this.activeAnimationSpeed);
    }

  }

  public getBullets(): Bullet[] {
    const bullets = [];

    if (this.bullet) {
      bullets.push(this.bullet);
    }

    return bullets;
  }

  private createGhostHead() {

    // create a group container
    this.ghostGroup = new Object3D();

    // load model and clone it
    const loader = new FBXLoader();

    loader.load('assets/3Dmodels/ghosthead.fbx', (object) => {

      object.position.x = 0;
      object.position.y = 900;
      object.position.z = 0;
      object.rotation.x = - Math.PI * 1.5;
      object.scale.x = object.scale.y = object.scale.z = 0.07;

      this.ghostHead = object;
      console.log('Ghooost', this.ghostHead);
      this.headMeshMaterial = this.ghostHead.children[0].material;
      this.ghostHead.boundingSphereRad = this.boundingSphereRad;
      this.ghostGroup.add(this.ghostHead);

      this.scene.add(this.ghostHead);

      this.headMeshMaterial.transparent = true;
      this.headMeshMaterial.opacity = 0.0;

      this.ghostAnimationMixer = new AnimationMixer( this.ghostHead );
      this.clips = this.ghostHead.animations;
      console.log('Armature|Laugh', this.ghostHeadAnimations.laugh);
      console.log('Ghost clips', this.clips);
      const clip = AnimationClip.findByName( this.clips, this.ghostHeadAnimations.idle.title);
      this.activeAnimationSpeed = this.ghostHeadAnimations.idle.speed;
      console.log('ghost clip', clip);
      this.activeAnimationAction = this.ghostAnimationMixer.clipAction( clip );
      setTimeout(() => {
        this.activeAnimationAction.play();
        this.appear();
        this.floaty();
      }, 1000);

    });
  }

  appear() {

    const tweenOpacityAppearPath = new TWEEN.Tween(this.headMeshMaterial)
      .to({
        opacity: 1.0
      }, 3000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    const tweenAppearPath = new TWEEN.Tween(this.ghostHead.position)
      .to({
        x: 0,
        y: 800,
        z: 0,
      }, 3000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  }

  floaty() {
    const tweenAppearPath = new TWEEN.Tween(this.ghostHead.position)
      .to({
        z: -30,
      }, 3000)
      .repeat( Infinity )
      .yoyo(true)
      .delay( 0 )
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  }

  receiveHit() {
    if (this.receivingHit) {
      return;
    }

    this.receivingHit = true;
    this.gameState.ghostHealth -= 5;

    const clip = AnimationClip.findByName(this.clips, this.ghostHeadAnimations.hit.title);
    this.activeAnimationAction = this.ghostAnimationMixer.clipAction( clip );
    this.activeAnimationSpeed = this.ghostHeadAnimations.hit.speed;
    this.activeAnimationAction.play();
    setTimeout(() => {
      this.activeAnimationAction.stop();
      const clipIdle = AnimationClip.findByName(this.clips, this.ghostHeadAnimations.idle.title);
      this.activeAnimationAction = this.ghostAnimationMixer.clipAction( clipIdle );
      this.activeAnimationSpeed = this.ghostHeadAnimations.idle.speed;
      this.activeAnimationAction.play();
      this.receivingHit = false;
    }, 980);
  }

}
