import { ButtonInteraction } from "discord.js";
import BotClient from "../classes/Client";
import * as discordModals from "discord-modals"
import { possibleWordleGuess } from "../constants/wordle";

export async function execute(interaction: ButtonInteraction, client: BotClient) {

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

}