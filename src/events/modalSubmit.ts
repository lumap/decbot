import { ModalSubmitInteraction } from "discord-modals";
import BotClient from "../classes/Client";
import { renderGrid } from "../functions/renderGrid";
import { letterToNum } from "../functions/letterToNum";
import { msButtons } from "../constants/msButtons";

export async function event(modal: ModalSubmitInteraction, client: BotClient) {
    let box = modal.getTextInputValue("ms-box"), tile_str = "", tile: number[] = [];
    const game = client.minesweeperGames.get(modal.user.id);
    if (!game) {
        await modal.deferReply({ ephemeral: true })
        return modal.followUp({
            content: "oopsie happened, or the bot restarted, sorry",
            ephemeral: true
        })
    }
    try {
        tile = [parseInt(box[0]) - 1, parseInt(box[2]) - 1]
        tile_str = `${tile[0]} ${tile[1]}`
        if (box[1] !== "," || !game.matrix[tile[0]] || !game.matrix[0][tile[1]] || tile[0] < -1 || tile[0] > 6 || tile[1] < -1 || tile[1] > 8) {
            await modal.deferReply({ ephemeral: true })
            return modal.followUp({
                content: "This tile does not seem to exist, or it was not inputed correctly",
            })
        }
    } catch (e) {
        console.log(e)
        await modal.deferReply({ ephemeral: true })
        return modal.followUp({
            content: "Something wrong happened when trying to see which tile you've selected, please try again",
        })
    }
    switch (modal.customId) {
        case "ms-reveal": {
            if (game.flagged.includes("" + tile_str)) {
                game.flagged = game.flagged.filter(i => i != "" + tile_str)
            }
            if (game.revealed.includes("" + tile_str)) {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({
                    content: "This tile has already been revealed!",
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
        case "ms-flag": {
            if (game.revealed.includes("" + tile_str)) {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({
                    content: "You can not flag a revealed tile!",
                })
                return;
            }
            game.flagged.push("" + tile_str)
            break;
        }
        case "ms-unflag": {
            if (!game.flagged.includes("" + tile_str)) {
                await modal.deferReply({ ephemeral: true })
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