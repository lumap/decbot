import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import BotClient from "../classes/Client";
import { possibleWordleSolutions } from "../constants/wordle";
import { timeUntilMidnight } from "../functions/timeUntilMidnight";


export function execute(interaction: CommandInteraction, client: BotClient) {
    const mode = interaction.options.getString("mode")!
    const wordleGuessedIds = client.db.get("wordleGuessedIds")
    if (mode == "daily") {
        if (wordleGuessedIds.includes(interaction.user.id)) {
            return interaction.reply({
                content: "You already guessed today's word! Come back in " + timeUntilMidnight(),
                ephemeral: true
            })
        }
        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId("wordle-daily-" + client.db.get("wordle"))
                    .setLabel("Guess a word")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setURL("https://cdn.discordapp.com/attachments/953309479582203994/956352563047956510/unknown.png?size=4096")
                    .setLabel("How to play")
                    .setStyle("LINK")
            ])
        interaction.reply({
            ephemeral: true,
            content: "Guess the daily wordle! Press the button to begin guessing today's word in 6 tries",
            components: [row]
        })
    } else if (mode == "unlimited") {
        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId("wordle-unlimited-" + possibleWordleSolutions[Math.round(Math.random() * possibleWordleSolutions.length)])
                    .setLabel("Guess a word")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setURL("https://cdn.discordapp.com/attachments/953309479582203994/956352563047956510/unknown.png?size=4096")
                    .setLabel("How to play")
                    .setStyle("LINK")
            ])
        interaction.reply({
            ephemeral: true,
            content: "Guess a random word! Press the button to begin a word in 6 tries",
            components: [row]
        })
    }
}