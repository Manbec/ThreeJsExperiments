import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {forEachComment} from 'tslint';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {
  AnimationMixer,
  Bone, Material,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  MeshToonMaterial,
  Scene,
  SkinnedMesh,
  TextureLoader
} from 'three';
import {root} from 'rxjs/internal-compatibility';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';

@Component({
  selector: 'app-threebeginners2',
  templateUrl: './threebeginners2.component.html',
  styleUrls: ['./threebeginners2.component.css']
})
export class Threebeginners2Component implements OnInit, AfterViewInit {

  /*
    Based on https://medium.com/@PavelLaptev/three-js-for-beginers-32ce451aabda
    Other links:
    https://moments.epic.net/#home
    https://threejs.org/
    https://experiments.withgoogle.com/konterball
    https://konterball.com/
    https://normanvr.com/#animatedshort
    GET GTLFs https://threejs.org/examples/misc_exporter_gltf.html
   */

  public renderer: any;
  public scene: Scene = new THREE.Scene();
  public mainPlane: any;
  public mainPlaneWidth = 3000;
  public light: any;
  public lightTwo: any;
  public lightAmbient: any;
  public camera: any;
  public distance: any;
  public raycaster: any;
  public mouse: any;
  public INTERSECTED: any;
  public projector: any;

  // get our <DIV> container
  public container: any;

  // Helper var which we will use as a additional correction coefficient for objects and camera
  public helperDistance = 10;

  // diamonds vars
  public waltGroup: any;
  public handGroup: any;
  public waltHead: any;
  public waltRightHand: any;
  public waltLeftHand: any;

  public lamp: any;

  // dots vars
  public dots: any;
  private clock = new THREE.Clock();
  private waltAnimationMixer: AnimationMixer;
  private waltLeftHandAnimationMixer: AnimationMixer;
  private waltRightHandAnimationMixer: AnimationMixer;
  private lampAnimationMixer: AnimationMixer;

  constructor() { }

  ngOnInit() {
    (window as any).scene = this.scene;
    (window as any).parent.THREE = THREE;
  }

  ngAfterViewInit() {
    this.container = document.getElementById('container');
    this.initScene();
    this.animate();
    window.addEventListener('resize', this.onWindowResize, false);

    document.addEventListener('mousedown', this.onDocumentMouseDown, false);

    this.GameLoop();
  }

  initScene() {
    // init render
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    // render window size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // background color
    this.renderer.setClearColor(0x000000, 1);
    // append render to the <DIV> container
    this.container.appendChild(this.renderer.domElement);

    // init scene, camera and camera position
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 25000);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.camera.position.set(-2700, 700, 2200);
    // adding camera to the scene
    this.scene.add(this.camera);
    const controls = new OrbitControls( this.camera, this.renderer.domElement );

    // LIGHTNING
    // first point light
    this.light = new THREE.PointLight(0xffffff, 1, 4000);
    this.light.position.set(50, 0, 0);
    // the second one
    this.lightTwo = new THREE.PointLight(0xffffff, 1, 4000);
    this.lightTwo.position.set(-100, 800, 800);
    // And another global lightning some sort of cripple GL
    this.lightAmbient = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light, this.lightTwo, this.lightAmbient);

    // OBJECTS
    // here we add objects by functions which we will write below
    this.createWalt();
    this.createLamp();
    this.createSpace();

    // adding scene and camera to the render
    console.log('siiin');
    console.log(this.scene);

    this.renderer.render(this.scene, this.camera);
  }

  createSpace() {

    const geometry = new THREE.PlaneGeometry( this.mainPlaneWidth, 2000, 2 );
    geometry.rotateX(Math.PI / 2);
    const planeMaterials = [
        new MeshBasicMaterial( { map: new TextureLoader( )
            .load( 'assets/textures/materials/concrete-flooring-texture-map-5c740a6ccae19.jpg' ), side: THREE.DoubleSide } )
    ];
    this.mainPlane = new THREE.Mesh( geometry, planeMaterials );
    this.scene.add( this.mainPlane );

  }

  createWalt() {
    // create a group container
    this.waltGroup = new THREE.Object3D();
    this.handGroup = new THREE.Object3D();

    // load model and clone it
    const loader = new FBXLoader();

    loader.load('assets/3Dmodels/walthead.fbx', (object) => {

      object.position.x = 1000;
      object.position.y = 1000;
      object.position.z = 0;
      object.rotation.y = Math.PI * 1.5;
      object.scale.x = object.scale.y = object.scale.z = 0.1;

      this.waltHead = object;
      this.waltGroup.add(this.waltHead);

      this.scene.add(this.waltHead);

      this.waltAnimationMixer = new THREE.AnimationMixer( this.waltHead );
      let clips = this.waltHead.animations;
      console.log("Walt clips", clips);
      let clip = THREE.AnimationClip.findByName( clips, 'Armature|Laugh' );
      console.log('walt clip', clip);
      let action = this.waltAnimationMixer.clipAction( clip );
      setTimeout(() => {
        action.play();
      }, 1000);

      // we will delete this line later
      this.renderer.render(this.scene, this.camera);

    });

    loader.load('assets/3Dmodels/walthand.fbx', (object) => {

      object.position.x = 1000;
      object.position.y = 1000;
      object.position.z = 500;
      object.rotation.y = Math.PI * 1.5;
      object.scale.x = object.scale.y = object.scale.z = 5;
      object.scale.x = -5;

      this.waltLeftHand = object;
      this.waltGroup.add(this.waltLeftHand);

      this.scene.add(this.waltLeftHand);


      this.waltLeftHandAnimationMixer = new THREE.AnimationMixer( this.waltLeftHand );
      let clips = this.waltLeftHand.animations;
      console.log("L Hand clips", clips);
      let clip = THREE.AnimationClip.findByName( clips, 'Armature|idle' );
      console.log('L hand clip', clip);
      let action = this.waltLeftHandAnimationMixer.clipAction( clip );
      setTimeout(() => {
        action.play();
      }, 1000);

      // we will delete this line later
      this.renderer.render(this.scene, this.camera);

    });

    loader.load('assets/3Dmodels/walthand.fbx', (object) => {

      object.position.x = 1000;
      object.position.y = 1000;
      object.position.z = -500;
      object.rotation.y = Math.PI * 1.5;
      object.scale.x = object.scale.y = object.scale.z = 5;

      this.waltRightHand = object;
      this.waltGroup.add(this.waltRightHand);

      this.scene.add(this.waltRightHand);


      this.waltRightHandAnimationMixer = new THREE.AnimationMixer( this.waltRightHand );
      let clips = this.waltRightHand.animations;
      console.log("L Hand clips", clips);
      let clip = THREE.AnimationClip.findByName( clips, 'Armature|idle' );
      console.log('L hand clip', clip);
      let action = this.waltRightHandAnimationMixer.clipAction( clip );
      setTimeout(() => {
        action.play();
      }, 1000);

      // we will delete this line later
      this.renderer.render(this.scene, this.camera);

    });


  }

  createLamp() {

    // setting up loader for a model
    const loader = new FBXLoader();
    // load model and clone it
    loader.load('assets/3Dmodels/animlamp.fbx', (object) => {

      object.position.x = -1000;
      object.position.y = 0;
      object.position.z = 0;
      object.rotation.y = Math.PI * 1.5;
      object.scale.x = object.scale.y = object.scale.z = (Math.random() * 1 + 10) * 0.3;

      // and randomly push it into userData object
      object.userData = {
        name: 'Pawge'
      };

      this.lamp = object;
      this.scene.add(this.lamp);

      // we will delete this line later

      console.log('lamp object', this.lamp);
      console.log('lamp this.lamp animations', this.lamp.animations);

      this.lampAnimationMixer = new THREE.AnimationMixer( this.lamp );
      let clips = this.lamp.animations;
      let clip = THREE.AnimationClip.findByName( clips, 'Armature|Look Around' );
      console.log('lamp clip', clip);
      let action = this.lampAnimationMixer.clipAction( clip );
      setTimeout(() => {
        action.play();
      }, 1000);
      this.renderer.render(this.scene, this.camera);

    });

    const handLoader = new GLTFLoader();
    // load walthand and clone it
    handLoader.load('assets/3Dmodels/rigged_lowpoly_hand/scene.gltf', (geometry) => {
      const material = new MeshToonMaterial({
        color: Math.random() * 0xff00000 - 0xff00000,
        // shading: THREE.FlatShading
      });

      const handou = geometry.scene.clone(true).children[0];
      const skinMesh: any = handou.children[0].children[0].children[0].children[2];
      const bones = [handou.children[0].children[0].children[0].children[0].clone(true)] as Bone[];

      let skellytone = new THREE.Skeleton( bones );
      let rootBone = skellytone.bones[ 0 ];

      rootBone.children.forEach((bone) => {

      });
      skinMesh.add( rootBone );
      skinMesh.material = material;

// bind the skeleton to the mesh

      skinMesh.bind( skellytone );

      handou.position.x = 0;
      handou.position.y = 100;
      handou.position.z = 0;
      handou.rotation.y = Math.PI * 1.5;
      handou.scale.x = handou.scale.y = handou.scale.z = (Math.random() * 1 + 10) * 10;

      // Create an AnimationMixer, and get the list of AnimationClip instances
      const mixer = new THREE.AnimationMixer( skinMesh );
      const clips = skinMesh.animations;
      return;
      // Update the mixer on each frame
      const deltaSeconds = 1;
      function update() {
        mixer.update( deltaSeconds );
      }

// Play a specific animation
      const clip = THREE.AnimationClip.findByName( clips, 'dance' );
      const action = mixer.clipAction( clip );
      action.play();

// Play all animations
      clips.forEach( function( clip ) {
        mixer.clipAction( clip ).play();
      } );

      /*
      // WORKS ON CHAIR AND SWORD and gltf logo
      console.log('HANDOU');
      console.log( geometry);
      console.log( geometry.scene.clone(true).children[0]);
      const handou = geometry.scene.clone(true).children[0];
      console.log('handou', handou);
      handou.position.x = 0;
      handou.position.y = 100;
      handou.position.z = 0;
      handou.rotation.y = Math.PI * 1.5;
      handou.scale.x = handou.scale.y = handou.scale.z = (Math.random() * 1 + 10) * 50;*/

      // and randomly push it into userData object
      handou.userData = {
        name: 'Pawge'
      };
      this.waltLeftHand = handou;
      this.handGroup.add(handou);

      this.scene.add(handou);

      const helper = new THREE.SkeletonHelper( handou );
      this.scene.add( helper );

      return;

      this.scene.add(geometry.scene.children[0]);
      this.renderer.render(this.scene, this.camera);

      const waltHand = geometry.scene.children[0].children[0].children[0].children[0];
      const waltHandLeft = geometry.scene.clone(true).children[0].children[0].children[0].children[0]; // new THREE.Mesh(geometry.asset, material);
      // console.log(waltHandLeft.children.splice(2, 1));
      console.log('walhanlef', waltHandLeft);

      const mesh = waltHand;
      const skeleton = waltHand.children[0].children;
      // mesh.add(waltHand.children[0].children[0]);
      // mesh.bind(skeleton);

      console.log('mosh', mesh);

      /*mesh.position.x = this.mainPlaneWidth;
      mesh.position.y = 1200;
      mesh.position.z = 500;
      mesh.rotation.y = Math.PI * 1.5;
      mesh.scale.x = mesh.scale.y = mesh.scale.z = (Math.random() * 1 + 10) * 0.6;

      // and randomly push it into userData object
      waltHandLeft.userData = {
        name: 'Pawge'
      };*/
      this.waltLeftHand = mesh;

      this.waltGroup.add(mesh);

      const waltHandRight = geometry.scene.clone(true).children[0].children[0].children[0].children[0]; // new THREE.Mesh(geometry.asset, material);
      console.log('walhanlef', waltHandLeft);
      waltHandRight.children.splice(2, 1);
      waltHandRight.position.x = this.mainPlaneWidth;
      waltHandRight.position.y = 1200;
      waltHandRight.position.z = -500;
      waltHandRight.rotation.y = Math.PI * 1.5;
      waltHandRight.scale.x = waltHandRight.scale.y = waltHandRight.scale.z = (Math.random() * 1 + 10) * 0.6;

      // and randomly push it into userData object
      waltHandRight.userData = {
        name: 'Pawge'
      };
      this.waltRightHand = waltHandRight;

      // this.waltGroup.add(waltHandRight);

      this.waltGroup.position.x = this.mainPlaneWidth / 2;
      this.scene.add(this.waltGroup);


      // we will delete this line later
      this.renderer.render(this.scene, this.camera);

    });


  }

  onWindowResize = () => {
    if (!this.camera) {
      return;
    }
    console.log(0);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.updateProjectionMatrix();
  }

  onMouseMove = (event) => {
    if (!this.camera) {
      return;
    }
    // set up camera position
    // this.camera.lookAt(this.scene.position);
  }

  onDocumentMouseDown = (event) => {

    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.waltGroup.children);
    if (intersects.length > 0) {
    }

  }

  animate = () => {
    requestAnimationFrame(this.animate);

    const delta = 0.75 * this.clock.getDelta();
    if (this.lampAnimationMixer) {
      this.lampAnimationMixer.update(delta);
    }
    if (this.waltAnimationMixer) {
      this.waltAnimationMixer.update(delta);
    }
    if (this.waltLeftHandAnimationMixer) {
      this.waltLeftHandAnimationMixer.update(delta);
    }
    if (this.waltRightHandAnimationMixer) {
      this.waltRightHandAnimationMixer.update(delta);
    }

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }


  // game logic
  update() {
    if (this.waltHead) {
      // this.waltHead.rotation.x += 0.01;
      // this.waltHead.rotation.y += 0.005;
    }
    /*if (this.waltRightHand && this.waltLeftHand) {
      this.waltRightHand.rotation.x += 0.01;
      this.waltRightHand.rotation.y += 0.005;
      this.waltLeftHand.rotation.x += 0.01;
      this.waltLeftHand.rotation.y += 0.005;
    }*/
  }

  // run game loop (update, render, repeat)
  GameLoop = () => {
    requestAnimationFrame(this.GameLoop);
    this.update();
    // this.animate();
    // this.render();
  }

}
