import { ButtonInteraction } from "discord.js";
import BotClient from "../classes/Client";

export function execute(interaction: ButtonInteraction, client: BotClient) {
    if (client.db.get(`giveaways.${interaction.message.id}.entrants`).includes(interaction.user.id)) {
        return interaction.reply({
            content: "You're already in it!",
            ephemeral: true
        })
    }
    client.db.push(`giveaways.${interaction.message.id}.entrants`, interaction.user.id);
    interaction.reply({
        content: "Giveaway succesffully joined!",
        ephemeral: true
    })
}