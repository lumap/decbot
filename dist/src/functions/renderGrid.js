"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGrid = void 0;
const emojis_1 = require("../constants/emojis");
const numToEmojis_1 = require("./numToEmojis");
function renderGrid(game, ended) {
    let str = `_ _            :regional_indicator_a::regional_indicator_b::regional_indicator_c::regional_indicator_d::regional_indicator_e::regional_indicator_f::regional_indicator_g::regional_indicator_h:\n\n`;
    if (!ended)
        ended = false;
    for (let i = 0; i < game.matrix.length; i++) {
        str += `${(0, numToEmojis_1.numToEmojis)(i + 1)}      `;
        for (let j = 0; j < game.matrix[0].length; j++) {
            if (game.revealed.includes(`${i} ${j}`) || ended == true) {
                str += emojis_1.emojis[game.matrix[i][j]];
            }
            else if (game.flagged.includes(`${i} ${j}`)) {
                str += emojis_1.emojis["flagged"];
            }
            else {
                str += emojis_1.emojis['notRevealed'];
            }
        }
        str += "\n";
    }
    str += `\n\n:clock2:${(0, numToEmojis_1.numToEmojis)(game.turn)}\n                        ${emojis_1.emojis['flagged']}${(0, numToEmojis_1.numToEmojis)(game.flagLimit - game.flagged.length)}\n${emojis_1.emojis['boom']}${(0, numToEmojis_1.numToEmojis)(game.bombsHitRemaining)}`;
    return str;
}
exports.renderGrid = renderGrid;
