import { ModalSubmitInteraction } from "discord-modals";
import BotClient from "../classes/Client";
import { renderGrid } from "../functions/renderGrid";
import { letterToNum } from "../functions/letterToNum";
import { msButtons } from "../constants/msButtons";

export function event(modal: ModalSubmitInteraction, client: BotClient) {
    let box = modal.getTextInputValue('ms-box'), tile_str = "", tile: number[] = [];
    const game = client.minesweeperGames.get(modal.member.id)!;
    try {
        tile = [parseInt(box[1]) - 1, letterToNum(box[0])]
        tile_str = `${tile[0]} ${tile[1]}`
        if (!game.matrix[tile[0]] || !game.matrix[0][tile[1]] || tile[0] < -1 || tile[0] > 6 || tile[1] < -1 || tile[1] > 8) {
            return modal.reply({
                content: "This tile does not seem to exist",
                ephemeral: true //DOSNT WORK
            })
        }
    } catch (e) {
        console.log(e)
        return modal.reply({
            content: "Something wrong happened when trying to see which tile you've selected, please try again",
            ephemeral: true //DOESNT WRK
        })
    }
    switch (modal.customId) {
        case 'ms-reveal': {
            if (game.flagged.includes("" + tile_str)) {
                game.flagged = game.flagged.filter(i => i != "" + tile_str)
            }
            if (game.revealed.includes("" + tile_str)) {
                modal.reply({
                    content: "This tile has already been revealed!",
                    ephemeral: true //DOSNT WORK
                })
                return;
            }
            const box_content = game.matrix[tile[0]][tile[1]]
            if (box_content == "boom") {
                game.remainingHP -= 1
                if (game.remainingHP == 0) {
                    modal.update({ components: [], content: renderGrid(client.minesweeperGames.get(modal.member.id), true) }).then(() => client.minesweeperGames.delete(modal.member.id))
                    return;
                }
                game.revealed.push("" + tile_str)
            } else (
                game.revealed.push("" + tile_str)
            )
            break;
        }
        case 'ms-flag': {
            if (game.revealed.includes("" + tile_str)) {
                modal.reply({
                    content: "You can not flag a revealed tile!",
                    ephemeral: true //DOESNT WORK
                })
                return;
            }
            game.flagged.push("" + tile_str)
            break;
        }
        case 'ms-unflag': {
            if (!game.flagged.includes("" + tile_str)) {
                modal.reply({
                    content: "You can't unflag a non flagged tile!"
                })
            }
            game.flagged = game.flagged.filter(i => i != "" + tile_str)
            break;
        }
        default: {
            console.log("how");
            break;
        }
    }
    game.turn += 1;
    client.minesweeperGames.set(modal.member.id, game)

    modal.update({
        content: renderGrid(client.minesweeperGames.get(modal.member.id), false),
        components: [msButtons]
    })
}