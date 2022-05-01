import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export function execute(interaction: CommandInteraction, client: BotClient) {
    const amount = interaction.options.getNumber("count"), user = interaction.options.getUser("user");
    if (!amount || !user) return;
    if ((client.db.get(`coins.${interaction.guild!.id}.${interaction.user.id}`) / 100 < amount) || Math.floor(amount * 100) <= 0) return interaction.reply({
        content: "You do not have enough coins!",
        ephemeral: true
    });
    if (interaction.user.id === user.id || user.bot) {
        return interaction.reply({
            content: "no",
            ephemeral: true
        })
    }
    client.db.subtract(`coins.${interaction.guild!.id}.${interaction.user.id}`, Math.floor(amount * 100))
    client.db.add(`coins.${interaction.guild!.id}.${user.id}`, Math.floor(amount * 100))
    interaction.reply({
        content: `${interaction.member} successfully gave **${amount}** coins to ${user}`
    })
}