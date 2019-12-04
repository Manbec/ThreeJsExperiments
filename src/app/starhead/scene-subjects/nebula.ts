import {Material, Mesh, MeshLambertMaterial, PlaneBufferGeometry, PointLight, Scene, TextureLoader} from 'three';
import {SceneSubject} from './scene.subject';
import {_Math} from 'three/src/math/Math';
import degToRad = _Math.degToRad;

export class Nebula extends SceneSubject {

  cloudParticles = [];

  constructor(scene: Scene) {
    super(scene);

    const loader = new TextureLoader();
    loader.load('assets/textures/smoke.png', (texture) => {
      // texture is loaded
      const cloudGeo = new PlaneBufferGeometry(500, 500);
      const cloudMaterial = new MeshLambertMaterial({
        map: texture,
        transparent: true
      });

      for (let i = 0; i < 50; i++) {

        const cloud = new Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
          Math.random() * 2200 - 1200,
          Math.random() * 100 + 900,
          Math.random() * 1000 - 500
        );
        cloud.rotation.x = degToRad(90);
        cloud.rotation.y = 0;
        cloud.rotation.z = Math.random() * 2 * Math.PI;
        (cloud.material as Material).opacity = 0.55;
        this.cloudParticles.push(cloud);
        scene.add(cloud);

      }

      const orangeLight = new PointLight(0xcc6600, 50, 450, 1.7);
      orangeLight.position.set(200, 700, 100);
      scene.add(orangeLight);
      const redLight = new PointLight(0xd8547e, 50, 450, 1.7);
      redLight.position.set(100, 700, 100);
      scene.add(redLight);
      const blueLight = new PointLight(0x3677ac, 50, 450, 1.7);
      blueLight.position.set(300, 700, 200);
      scene.add(blueLight);

    });


    }

  public update(elapsedTime: number): void {
      this.cloudParticles.forEach(p => {
        p.rotation.z -= 0.001;
      });
  }

}
