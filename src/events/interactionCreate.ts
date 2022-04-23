import { GuildMemberRoleManager, Interaction, MessageActionRow, MessageButton } from "discord.js";
import BotClient from "../classes/Client";

export function event(interaction: Interaction, client: BotClient) {
    if (!interaction.guild) return;
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) return console.log(interaction.commandName)
        cmd.execute(interaction, client)
    } else if (interaction.isButton()) {
        const buttonHandler = client.buttonHandlers.get(interaction.customId.split("-")[0]);
        if (!buttonHandler) return console.log(interaction.customId);
        buttonHandler.execute(interaction, client)
    }
}