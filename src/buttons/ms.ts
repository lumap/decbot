import { ButtonInteraction } from "discord.js";
import BotClient from "../classes/Client";
import { renderGrid } from "../functions/renderGrid";
import { msButtons } from "../constants/msButtons";
import { fixId } from "../functions/fixId";
import * as discordModals from "discord-modals"

export async function execute(interaction: ButtonInteraction, client: BotClient) {

    const gameId = interaction.customId.split("-")[interaction.customId.split("-").length - 1]
    switch (fixId(interaction.customId)) {
        case "ms-start": {
            msButtons.components[0].setCustomId("ms-flag-" + gameId)
            msButtons.components[1].setCustomId("ms-unflag-" + gameId)
            msButtons.components[2].setCustomId("ms-reveal-" + gameId)
            msButtons.components[3].setCustomId("ms-stop-game-" + gameId)
            interaction.update({
                content: renderGrid(client.minesweeperGames.get(gameId), false),
                components: [msButtons],
            })
            break;
        }
        case "ms-cancel": {
            interaction.update({ content: "Ok...", components: [] })
            client.minesweeperGames.delete(gameId)
            break;
        }
        case "ms-flag": {
            const flagModal = new discordModals.Modal()
                .setCustomId("ms-flag-" + gameId)
                .setTitle("Interact with the grid")
            flagModal.components = [
                new discordModals.TextInputComponent()
                    .setCustomId("ms-box")
                    .setLabel("Which tile do you want to flag?")
                    .setStyle("SHORT")
                    .setMinLength(3)
                    .setMaxLength(3)
                    .setPlaceholder("x,y")
                    .setRequired(true)
            ]
            discordModals.showModal(flagModal, {
                client: client,
                interaction: interaction
            })
            break;
        }
        case "ms-unflag": {
            const unflagModal = new discordModals.Modal()
                .setCustomId("ms-unflag-" + gameId)
                .setTitle("Interact with the grid")
            unflagModal.components = [
                new discordModals.TextInputComponent()
                    .setCustomId("ms-box")
                    .setLabel("Which tile do you want to unflag?")
                    .setStyle("SHORT")
                    .setMinLength(3)
                    .setMaxLength(3)
                    .setPlaceholder("x,y")
                    .setRequired(true)
            ]
            discordModals.showModal(unflagModal, {
                client: client,
                interaction: interaction
            })
            break;
        }
        case "ms-reveal": {
            const revealModal = new discordModals.Modal()
                .setCustomId("ms-reveal-" + gameId)
                .setTitle("Interact with the grid")
            revealModal.components = [new discordModals.TextInputComponent()
                .setCustomId("ms-box")
                .setLabel("What do you want to reveal?")
                .setStyle("SHORT")
                .setMinLength(3)
                .setMaxLength(3)
                .setPlaceholder("x,y")
                .setRequired(true)
            ]
            discordModals.showModal(revealModal, {
                client: client,
                interaction: interaction
            })
            break;
        }
        case "ms-stop-game": {
            interaction.update({
                components: [], content: renderGrid(client.minesweeperGames.get(gameId), true)
            }).then(() => client.minesweeperGames.delete(gameId))
            break;
        }
        default: {
            break;
        }
    }

}