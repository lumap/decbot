"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const renderGrid_1 = require("../functions/renderGrid");
const letterToNum_1 = require("../functions/letterToNum");
const msButtons_1 = require("../constants/msButtons");
function event(modal, client) {
    let box = modal.getTextInputValue('ms-box'), tile_str = "", tile = [];
    const game = client.minesweeperGames.get(modal.member.id);
    try {
        tile = [parseInt(box[1]) - 1, (0, letterToNum_1.letterToNum)(box[0])];
        tile_str = `${tile[0]} ${tile[1]}`;
        if (!game.matrix[tile[0]] || !game.matrix[0][tile[1]] || tile[0] < -1 || tile[0] > 6 || tile[1] < -1 || tile[1] > 8) {
            return modal.reply({
                content: "This tile does not seem to exist",
                ephemeral: true //DOSNT WORK
            });
        }
    }
    catch (e) {
        console.log(e);
        return modal.reply({
            content: "Something wrong happened when trying to see which tile you've selected, please try again",
            ephemeral: true //DOESNT WRK
        });
    }
    switch (modal.customId) {
        case 'ms-reveal': {
            if (game.flagged.includes("" + tile_str)) {
                game.flagged = game.flagged.filter(i => i != "" + tile_str);
            }
            if (game.revealed.includes("" + tile_str)) {
                modal.reply({
                    content: "This tile has already been revealed!",
                    ephemeral: true //DOSNT WORK
                });
                return;
            }
            const box_content = game.matrix[tile[0]][tile[1]];
            if (box_content == "boom") {
                game.remainingHP -= 1;
                if (game.remainingHP == 0) {
                    modal.update({ components: [], content: (0, renderGrid_1.renderGrid)(client.minesweeperGames.get(modal.member.id), true) }).then(() => client.minesweeperGames.delete(modal.member.id));
                    return;
                }
                game.revealed.push("" + tile_str);
            }
            else
                (game.revealed.push("" + tile_str));
            break;
        }
        case 'ms-flag': {
            if (game.revealed.includes("" + tile_str)) {
                modal.reply({
                    content: "You can not flag a revealed tile!",
                    ephemeral: true //DOESNT WORK
                });
                return;
            }
            game.flagged.push("" + tile_str);
            break;
        }
        case 'ms-unflag': {
            if (!game.flagged.includes("" + tile_str)) {
                modal.reply({
                    content: "You can't unflag a non flagged tile!"
                });
            }
            game.flagged = game.flagged.filter(i => i != "" + tile_str);
            break;
        }
        default: {
            console.log("how");
            break;
        }
    }
    game.turn += 1;
    client.minesweeperGames.set(modal.member.id, game);
    modal.update({
        content: (0, renderGrid_1.renderGrid)(client.minesweeperGames.get(modal.member.id), false),
        components: [msButtons_1.msButtons]
    });
}
exports.event = event;
