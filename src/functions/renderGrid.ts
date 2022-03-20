import { emojis } from "../constants/emojis"
import { numToEmojis } from "./numToEmojis";

export function renderGrid(game, ended) {
    let str = `_ _            :regional_indicator_a::regional_indicator_b::regional_indicator_c::regional_indicator_d::regional_indicator_e::regional_indicator_f::regional_indicator_g::regional_indicator_h:\n\n`;
    if (!ended) ended = false
    for (let i = 0; i < game.matrix.length; i++) {
        str += `${numToEmojis(i + 1)}      `;
        for (let j = 0; j < game.matrix[0].length; j++) {
            if (game.revealed.includes(`${i} ${j}`) || ended == true) {
                str += emojis[game.matrix[i][j]]
            } else if (game.flagged.includes(`${i} ${j}`)) {
                str += emojis["flagged"]
            } else {
                str += emojis['notRevealed']
            }
        }
        str += "\n"
    }
    str += `\n\n:clock2:${numToEmojis(game.turn)}\n                        ${emojis['flagged']}${numToEmojis(game.flagLimit - game.flagged.length)}\n${emojis['boom']}${numToEmojis(game.bombsHitRemaining)}`
    return str
}