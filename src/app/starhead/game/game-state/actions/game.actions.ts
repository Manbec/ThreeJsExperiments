export class IsGameStarted {
  static readonly type = '[GameState] Game Is Started';
}

export class SetGameStarted {
  static readonly type = '[GameState] Set Game Is Started';
  constructor(public gameStarted: boolean) {}
}

export class PlayerHasMoved {
  static readonly type = '[GameState] Player Has Moved';
}
