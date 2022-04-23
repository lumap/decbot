import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export function execute(interaction: CommandInteraction, client: BotClient) {
    let user = interaction.options.getUser("user")?.id;
    if (!user) {
        return interaction.reply({
            content: `You have **${client.db.get("coins." + interaction.user.id) / 100}** coins`,
            ephemeral: true
        })
    }
    interaction.reply({
        content: `<@${user}> has **${client.db.get("coins." + user) / 100}** coins.`,
        ephemeral: true
    })
}