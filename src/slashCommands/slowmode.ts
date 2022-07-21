import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export async function execute(interaction: CommandInteraction, _client: BotClient) {
    //@ts-ignore
    if (!interaction.member?.permissions.has("BAN_MEMBERS")) {
        return interaction.reply({
            content: "No.",
            ephemeral: true
        })
    }
    await interaction.deferReply();
    let slowmode = interaction.options.getInteger("time")!;
    if (!interaction.channel?.isText()) return; //@ts-ignore
    await interaction.channel!.setRateLimitPerUser(slowmode);
    interaction.editReply({
        content: "Done!"
    })
}