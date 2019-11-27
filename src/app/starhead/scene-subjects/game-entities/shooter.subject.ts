import {Scene} from 'three';
import {SceneSubject} from '../scene.subject';

export abstract class ShooterComponentSubject extends SceneSubject {

  private shootingSpeed = 0;

  constructor(scene: Scene) {
    super(scene);
  }

  public abstract update(elapsedTime: number): void;

}
