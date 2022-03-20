import { Interaction, MessageActionRow, MessageButton } from "discord.js";
import BotClient from "../classes/Client";
import * as discordModals from "discord-modals"
import { renderGrid } from "../functions/renderGrid";
import { msButtons } from "../constants/msButtons";

export function event(interaction: Interaction, client: BotClient) {
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) return console.log(interaction.commandName)
        cmd.execute(interaction,client)
    } else if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'ms-start': {
                interaction.update({
                    content: renderGrid(client.minesweeperGames.get(interaction.user.id), false),
                    components: [msButtons],
                })
                break;
            }
            case 'ms-cancel': {
                interaction.update({ content: "Ok...", components: [] })
                client.minesweeperGames.delete(interaction.user.id)
                break;
            }
            case 'ms-flag': {
                const flagModal = new discordModals.Modal() 
                    .setCustomId('ms-flag')
                    .setTitle('Interact with the grid')
                flagModal.components = [
                    new discordModals.TextInputComponent()
                        .setCustomId('ms-box')
                        .setLabel('Which tile do you want to flag?')
                        .setStyle('SHORT') 
                        .setMinLength(2)
                        .setMaxLength(2)
                        .setPlaceholder('a1')
                        .setRequired(true) 
                ]
                discordModals.showModal(flagModal, {
                    client: client,
                    interaction: interaction
                })
                break;
            }
            case 'ms-unflag': {
                const unflagModal = new discordModals.Modal()
                    .setCustomId('ms-unflag')
                    .setTitle('Interact with the grid')
                unflagModal.components = [
                    new discordModals.TextInputComponent()
                        .setCustomId('ms-box')
                        .setLabel('Which tile do you want to unflag?')
                        .setStyle('SHORT')
                        .setMinLength(2)
                        .setMaxLength(2)
                        .setPlaceholder('a1')
                        .setRequired(true)
                ]
                discordModals.showModal(unflagModal, {
                    client: client,
                    interaction: interaction
                })
                break;
            }
            case 'ms-reveal': {
                const revealModal = new discordModals.Modal() 
                    .setCustomId('ms-reveal')
                    .setTitle('Interact with the grid')
                revealModal.components = [new discordModals.TextInputComponent() 
                    .setCustomId('ms-box')
                    .setLabel('What do you want to reveal?')
                    .setStyle('SHORT') 
                    .setMinLength(2)
                    .setMaxLength(2)
                    .setPlaceholder('a1')
                    .setRequired(true) 
                ]
                discordModals.showModal(revealModal, {
                    client: client,
                    interaction: interaction
                })
                break;
            }
            case 'ms-stop-game': {
                interaction.update({
                    components: [], content: renderGrid(client.minesweeperGames.get(interaction.user.id), true)
                }).then(() => client.minesweeperGames.delete(interaction.user.id))
                break;
            }
            default: {
                break;
            }
        }
    }
}