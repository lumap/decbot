import { emojis } from "../constants/emojis"
import { numToEmojis } from "./numToEmojis";

export function renderGrid(game, ended: boolean) {
    let str = `_ _     x→:one::two::three::four::five::six::seven::eight:\ny↓\n`;
    if (!ended) ended = false
    if (!game) return "oopsie;"
    for (let i = 0; i < game.matrix.length; i++) {
        str += `${numToEmojis(i + 1)}      `;
        for (let j = 0; j < game.matrix[0].length; j++) {
            if (game.revealed.includes(`${i} ${j}`) || ended == true) {
                str += emojis[game.matrix[i][j]]
            } else if (game.flagged.includes(`${i} ${j}`)) {
                str += emojis["flagged"]
            } else {
                str += emojis["notRevealed"]
            }
        }
        str += "\n"
    }
    str += `\n\n:clock2:${numToEmojis(game.turn)}\n                        ${emojis["flagged"]}${numToEmojis(game.flagLimit - game.flagged.length)}\n${emojis["boom"]}${numToEmojis(game.remainingHP)}`
    return str
}