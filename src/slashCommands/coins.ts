import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export function execute(interaction: CommandInteraction, client: BotClient) {
    let user = interaction.options.getUser("user")?.id;
    if (!user) {
        if (!client.db.get(`coins.${interaction.guildId}.${interaction.user.id}`)) client.db.set(`coins.${interaction.guildId}.${interaction.user.id}`, 0)
        return interaction.reply({
            content: `You have **${client.db.get(`coins.${interaction.guildId}.${interaction.user.id}`) / 100}** coins`,
            ephemeral: true
        })
    }
    if (!client.db.get(`coins.${interaction.guildId}.${user}`)) client.db.set(`coins.${interaction.guildId}.${user}`, 0)
    interaction.reply({
        content: `<@${user}> has **${client.db.get(`coins.${interaction.guildId}.${user}`) / 100}** coins.`,
        ephemeral: true
    })
}