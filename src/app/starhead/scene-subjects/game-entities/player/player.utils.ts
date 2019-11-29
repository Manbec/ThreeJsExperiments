import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from 'three';

export const geometryBulletPlayer = new SphereBufferGeometry(.4, 16, 16);
export const materialBulletPlayer = new MeshBasicMaterial();
export const blueprintBulletPlayer = new Mesh(geometryBulletPlayer, materialBulletPlayer);
