import {Vector3} from 'three';

export const defaultInitalHealth = 100;

export interface GameStateModel {
  gameStarted: boolean;
  playerHasMoved: boolean;
  enableUserInput: boolean;
  health: number;
  playerPosition: Vector3;
}
