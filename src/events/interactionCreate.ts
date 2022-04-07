import { GuildMemberRoleManager, Interaction, MessageActionRow, MessageButton } from "discord.js";
import BotClient from "../classes/Client";
import * as discordModals from "discord-modals"
import { renderGrid } from "../functions/renderGrid";
import { msButtons } from "../constants/msButtons";
import { fixId } from "../functions/fixId";
import { possibleWordleGuess } from "../constants/wordle";

export function event(interaction: Interaction, client: BotClient) {
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) return console.log(interaction.commandName)
        cmd.execute(interaction, client)
    } else if (interaction.isButton()) {
        if (interaction.customId.startsWith("ms")) {
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
        } else if (interaction.customId.startsWith("wordle")) {
            const wordleModal = new discordModals.Modal()
                .setCustomId(interaction.customId)
                .setTitle("Guess a word")
            wordleModal.components = [
                new discordModals.TextInputComponent()
                    .setCustomId("wordle-guess")
                    .setLabel("What's your guess?")
                    .setStyle("SHORT")
                    .setMinLength(5)
                    .setMaxLength(5)
                    .setPlaceholder(possibleWordleGuess[Math.round(Math.random() * possibleWordleGuess.length)])
                    .setRequired(true)
            ]
            discordModals.showModal(wordleModal, {
                client: client,
                interaction: interaction
            })
        } else if (interaction.customId.startsWith("rr")) {
            const roleId = interaction.customId.split("-")[1];
            if (!interaction.guild?.roles.cache.has(roleId)) {
                return interaction.reply({
                    content: "Looks like this role does not exist anymore...",
                    ephemeral: true
                });
            }
            //@ts-ignore
            if (interaction.member!.roles.cache.has(roleId)) { //@ts-ignore
                interaction.member!.roles.remove(roleId)
                interaction.reply({
                    content: "Role removed!",
                    ephemeral: true
                })
            } else { //@ts-ignore
                interaction.member!.roles.add(roleId)
                interaction.reply({
                    content: "Role added!",
                    ephemeral: true
                })
            }
        }
    }
}