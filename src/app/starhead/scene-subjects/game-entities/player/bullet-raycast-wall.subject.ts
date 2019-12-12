import {
  Mesh,
  MeshBasicMaterial,
  Scene,
  TextureLoader,
  DoubleSide,
  PlaneGeometry,
  Vector2,
  Raycaster, Camera, Object3D, Vector3
} from 'three';
import {SceneSubject} from '../../scene.subject';
import {withLatestFrom} from 'rxjs/operators';

export class BulletRaycastWall extends SceneSubject {

  private bulletRayCastWall: Mesh;
  private mainPlaneWidth: number;
  private mainPlaneHeight: number;

  private scene: Scene;
  private screenDistanceWidthSizeRatio: number;
  private screenDistanceHeightSizeRatio: number;
  private raycastMouse: Vector2;
  private raycaster: Raycaster;
  private camera: Camera;
  public raycastWallIntersectionLocation: Vector3;

  constructor(scene: Scene, camera: Camera) {
    super(scene);
    this.scene = scene;
    this.camera = camera;

    // 400 away from the screen it fits perfectly,
    // on 1200 distance away (behind nebula) it is a 3x ratio distance so we multiply the plane by 3 to make it cover the screen

    this.screenDistanceWidthSizeRatio = 3.5;
    this.screenDistanceHeightSizeRatio = 3.3;

    this.mainPlaneHeight = document.documentElement.clientHeight * this.screenDistanceHeightSizeRatio;
    this.mainPlaneWidth = document.documentElement.clientWidth * this.screenDistanceWidthSizeRatio;

    this.loadBulletRayCastWall();

    this.raycaster = new Raycaster();
    this.raycastMouse = new Vector2();

  }


  public update(elapsedTime: number): void {

  }

  loadBulletRayCastWall() {

    const geometry = new PlaneGeometry( this.mainPlaneWidth * this.screenDistanceWidthSizeRatio, this.mainPlaneHeight, 2 );
    geometry.rotateX(Math.PI / 2);
    const planeMaterials = [
      new MeshBasicMaterial( { map: new TextureLoader( )
          .load( 'assets/textures/materials/concrete-flooring-texture-map-5c740a6ccae19.jpg' ), side: DoubleSide } )
    ];
    this.bulletRayCastWall = new Mesh( geometry, planeMaterials );
    console.log(this.bulletRayCastWall.material);
    this.bulletRayCastWall.material[0].transparent = true;
    this.bulletRayCastWall.material[0].opacity = 0.0;
    this.scene.add( this.bulletRayCastWall );

  }

  setPosition(positionX: number, positionY: number, positionZ: number) {
    this.bulletRayCastWall.position.set(positionX, positionY, positionZ);
  }

  onMouseDown = (event) => {
    event.preventDefault();
    this.raycastMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.raycastMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.raycastMouse, this.camera);
    const intersects = this.raycaster.intersectObjects([this.bulletRayCastWall as Object3D]);

    if (!intersects.length) {
      return;
    }

    this.raycastWallIntersectionLocation = intersects[0].point;

  }

  onWindowResize(width: number, height: number) {
    const newWidthScale = document.documentElement.clientWidth / this.mainPlaneWidth;
    const newHeightScale = document.documentElement.clientHeight / this.mainPlaneHeight;
    this.bulletRayCastWall.scale.set(newWidthScale, newHeightScale, 1);

  }

}
