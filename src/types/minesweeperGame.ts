type minesweeperGame = Map<string,{
    matrix: string[][],
    revealed: string[],
    flagged: string[],
    flagLimit: number,
    turn: number,
    remainingHP: number,
    starterID: string
}>