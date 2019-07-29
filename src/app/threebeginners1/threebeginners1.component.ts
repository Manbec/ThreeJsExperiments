import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {forEachComment} from 'tslint';

@Component({
  selector: 'app-threebeginners1',
  templateUrl: './threebeginners1.component.html',
  styleUrls: ['./threebeginners1.component.css']
})
export class Threebeginners1Component implements OnInit, AfterViewInit {

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
  public helperDistance = 400;

  // spheres vars
  public spheres: any;

  // diamonds vars
  public diamondsGroup: any;

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
    this.renderer.setClearColor(0x140b33, 1);
    // append render to the <DIV> container
    this.container.appendChild(this.renderer.domElement);

    // init scene, camera and camera position
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 25000);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.camera.position.set(100, -400, 2000);
    // adding camera to the scene
    this.scene.add(this.camera);

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
    this.createSpheres();
    this.createDiamond();
    this.createSpace();

    // adding scene and camera to the render
    this.renderer.render(this.scene, this.camera);
  }

  createSpheres() {

    this.spheres = new THREE.Object3D();

// create array with any links
    let arr = ['https://en.wikipedia.org/wiki/Sphere',
      'https://en.wikipedia.org/wiki/Ellipse',
      'https://en.wikipedia.org/wiki/Ellipsoid',
      'https://en.wikipedia.org/wiki/Spheroid'];

    for (let i = 0; i < 80; i++) {
      const sphere = new THREE.SphereGeometry(4, Math.random() * 12, Math.random() * 12);
      const material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xff00000 - 0xff00000,
        // shading: THREE.FlatShading,
      });

      const particle = new THREE.Mesh(sphere, material);
      particle.position.x = Math.random() * this.helperDistance * 10;
      particle.position.y = Math.random() * -this.helperDistance * 6;
      particle.position.z = Math.random() * this.helperDistance * 4;
      particle.rotation.y = Math.random() * 2 * Math.PI;
      particle.scale.x = particle.scale.y = particle.scale.z = Math.random() * 12 + 5;

      // and randomly push it into userData object
      particle.userData = {
        URL: arr[Math.floor(Math.random() * arr.length)]
      };

      this.spheres.add(particle);
    }

    this.spheres.position.y = 500;
    this.spheres.position.x = -2000;
    this.spheres.position.z = -100;
    this.spheres.rotation.y = Math.PI * 600;

    this.scene.add(this.spheres);
  }

  createDiamond() {
    // create a group container
    this.diamondsGroup = new THREE.Object3D();

    // create array with any links
    let arr = ['https://en.wikipedia.org/wiki/Walter_W._Head'];

    // setting up loader for a model
    const loader = new GLTFLoader();

    // load model and clone it
    loader.load('assets/3Dmodels/walthead.gltf', (geometry) => {
      for (let i = 0; i < 60; i++) {
        const material = new THREE.MeshPhongMaterial({
          color: Math.random() * 0xff00000 - 0xff00000,
          // shading: THREE.FlatShading
        });
        const diamond = geometry.scene.clone(true).children[0]; // new THREE.Mesh(geometry.asset, material);
        diamond.position.x = Math.random() * -this.helperDistance * 6 + 1400;
        diamond.position.y = Math.random() * -this.helperDistance * 2;
        diamond.position.z = Math.random() * this.helperDistance * 3;
        diamond.rotation.y = Math.random() * 2 * Math.PI;
        diamond.scale.x = diamond.scale.y = diamond.scale.z = (Math.random() * 1 + 10) * 0.3;

        // and randomly push it into userData object
        diamond.userData = {
          URL: arr[Math.floor(Math.random() * arr.length)]
        };

        this.diamondsGroup.add(diamond);

        // this.scene.add(diamond);
      }

      this.diamondsGroup.position.x = 1400;
      this.scene.add(this.diamondsGroup);

      // we will delete this line later
      this.renderer.render(this.scene, this.camera);

    });
  }

  createSpace() {

    this.dots = new THREE.Object3D();

    for (let i = 0; i < 420; i++) {
      const circleGeometry = new THREE.SphereGeometry(2, Math.random() * 5, Math.random() * 5);
      // change meterial
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xff00000 - 0xff00000,
        // shading: THREE.FlatShading,
      });
      const circle = new THREE.Mesh(circleGeometry, material);
      material.side = THREE.DoubleSide;

      circle.position.x = Math.random() * -this.helperDistance * 60;
      circle.position.y = Math.random() * -this.helperDistance * 6;
      circle.position.z = Math.random() * this.helperDistance * 3;
      circle.rotation.y = Math.random() * 2 * Math.PI;
      circle.scale.x = circle.scale.y = circle.scale.z = Math.random() * 6 + 5;
      this.dots.add(circle);
    }

    this.dots.position.x = 7000;
    this.dots.position.y = 900;
    this.dots.position.z = -2000;
    this.dots.rotation.y = Math.PI * 600;
    this.dots.rotation.z = Math.PI * 500;

    this.scene.add(this.dots);
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
    const mouseX = event.clientX - window.innerWidth / 2;
    const mouseY = event.clientY - window.innerHeight / 2;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.camera.position.x += (mouseX - this.camera.position.x) * 0.005;
    this.camera.position.y += (mouseY - this.camera.position.y) * 0.005;
    // set up camera position
    this.camera.lookAt(this.scene.position);
  }

  onDocumentMouseDown = (event) => {

    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.spheres.children);
    if (intersects.length > 0) {
      // get a link from the userData object
      window.open(intersects[0].object.userData.URL);
    }

    const diamondsChildrenMesh = [];
    for (const child of this.diamondsGroup.children) {
      diamondsChildrenMesh.push(child.children[0]);
    }
    const intersectsDiamonds = this.raycaster.intersectObjects(diamondsChildrenMesh);
    if (intersectsDiamonds.length > 0) {
      // get a link from the userData object
      window.open(this.diamondsGroup.children[0].userData.URL);
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  }
  render() {
    // original example from here https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_pointlights.html
    const timer = 0.00001 * Date.now();
    // come up with random animation
    for (let i = 0, l = this.diamondsGroup.children.length; i < l; i++) {
      const object = this.diamondsGroup.children[i];
      object.position.y = 500 * Math.cos(timer + i);
      object.rotation.y += Math.PI / 500;
    }
    for (let i = 0, l = this.spheres.children.length; i < l; i++) {
      const object = this.spheres.children[i];
      object.rotation.y += Math.PI / 60;
      if (i < 20) {
        object.rotation.y -= Math.PI / 40;
      }
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersectsSpheres = this.raycaster.intersectObjects(this.spheres.children);
    // console.log("intersectsSpheres");
    // console.log(intersectsSpheres);
    if (intersectsSpheres.length > 0) {
      if (this.INTERSECTED !== intersectsSpheres[0].object) {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
        }
        this.INTERSECTED = intersectsSpheres[0].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(Math.random() * 0xff00000 - 0xff00000);
      }
    } else {
      if (this.INTERSECTED) {
        this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
      }
      this.INTERSECTED = null;
    }

    const diamondsChildrenMesh = [];
    for (const child of this.diamondsGroup.children) {
      diamondsChildrenMesh.push(child.children[0]);
    }
    const intersectsDiamonds = this.raycaster.intersectObjects(diamondsChildrenMesh);
    //console.log('intersectsDiamonds');
    //console.log(diamondsChildrenMesh);
    //console.log(intersectsDiamonds);
    if (intersectsDiamonds.length > 0) {
      if (this.INTERSECTED !== intersectsDiamonds[0].object) {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
        }
        this.INTERSECTED = intersectsDiamonds[0].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(Math.random() * 0xff00000 - 0xff00000);
      }
    } else {
      if (this.INTERSECTED) {
        this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
      }
      this.INTERSECTED = null;
    }

    this.renderer.render(this.scene, this.camera);
  }

}
