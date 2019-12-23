import {Vector3} from 'three';

export const defaultInitalHealth = 100;
export const defaultGhostInitalHealth = 200;

export interface GameStateModel {
  gameStarted: boolean;
  playerHasMoved: boolean;
  enableUserInput: boolean;
  playerHealth: number;
  ghostHealth: number;
  playerPosition: Vector3;
}
