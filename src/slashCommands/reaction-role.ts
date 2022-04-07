import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import BotClient from "../classes/Client";

export async function execute(interaction: CommandInteraction, _client: BotClient) {
    await interaction.deferReply();
    let role = interaction.options.getRole("role")!, msg = interaction.options.getString("message") || "Click the button below to get the corresponding role."
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("rr-" + role.id)
                .setLabel(`<@&${role.id}>`)
                .setStyle("PRIMARY"),
        );
    interaction.channel!.send({
        content: msg,
        components: [row]
    })
}