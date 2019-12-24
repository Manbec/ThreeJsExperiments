import {Vector3} from 'three';

export class IsGameStarted {
  static readonly type = '[GameState] Game Is Started';
}

export class SetGameStarted {
  static readonly type = '[GameState] Set Game Is Started';
  constructor(public gameStarted: boolean) {}
}

export class GetPlayerPosition {
  static readonly type = '[PlayerState] Get Player Position';
}

export class SetPlayerPosition {
  static readonly type = '[PlayerState] Set Player Position';
  constructor(public playerPosition: Vector3) {}
}
