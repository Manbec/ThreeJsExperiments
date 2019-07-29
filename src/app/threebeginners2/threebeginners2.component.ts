import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {forEachComment} from 'tslint';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {MeshBasicMaterial, MeshLambertMaterial, MeshPhysicalMaterial, MeshToonMaterial, TextureLoader} from 'three';

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
  public scene: any;
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

  // spheres vars
  public spheres: any;

  // diamonds vars
  public waltGroup: any;

  // dots vars
  public dots: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.container = document.getElementById('container');
    this.initScene();
    this.animate();
    window.addEventListener('resize', this.onWindowResize, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
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
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 25000);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.camera.position.set(-2700, 1000, 1200);
    // adding camera to the scene
    this.scene.add(this.camera);
    let controls = new OrbitControls( this.camera, this.renderer.domElement );

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
    this.createSpace();

    // adding scene and camera to the render
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

    // setting up loader for a model
    const loader = new GLTFLoader();

    // load model and clone it
    loader.load('assets/3Dmodels/walthead.gltf', (geometry) => {
      const material = new MeshToonMaterial({
        color: Math.random() * 0xff00000 - 0xff00000,
        // shading: THREE.FlatShading
      });
      const diamond = geometry.scene.clone(true).children[0]; // new THREE.Mesh(geometry.asset, material);
      diamond.position.x = 0;
      diamond.position.y = 0;
      diamond.position.z = 0;
      diamond.rotation.y = Math.PI * 1.5;
      diamond.scale.x = diamond.scale.y = diamond.scale.z = (Math.random() * 1 + 10) * 0.3;

      // and randomly push it into userData object
      diamond.userData = {
        name: 'Pawge'
      };

      this.waltGroup.add(diamond);

      // this.scene.add(diamond);

      this.waltGroup.position.x = this.mainPlaneWidth/2;
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
    //this.camera.lookAt(this.scene.position);
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
    this.render();
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }

}
