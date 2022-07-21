import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
import BotClient from "../classes/Client";

export function execute(interaction: ButtonInteraction, client: BotClient) {
    const roleId = interaction.customId.split("-")[1];
    if (roleId === "cancel") {
        return interaction.update({
            content: "Yep, that's what I thought. Not removing it.",
            components: []
        })
    }
    if (roleId === "remove") {// @ts-ignore
        interaction.member!.roles.remove(interaction.customId.split("-")[2]);
        return interaction.update({
            content: "Ok... role removed.",
            components: []
        })
    }
    if (!interaction.guild?.roles.cache.has(roleId)) {
        return interaction.reply({
            content: "Looks like this role does not exist anymore...",
            ephemeral: true
        });
    }
    //@ts-ignore
    if (interaction.member!.roles.cache.has(roleId)) {
        let row = [new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId("rr-remove-" + roleId)
                    .setLabel("Yes")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("rr-cancel")
                    .setLabel("No")
                    .setStyle("SUCCESS")
            ])]
        interaction.reply({
            content: "You already have this role! Do you want it to be removed?",
            ephemeral: true,
            components: row
        })
    } else { //@ts-ignore
        interaction.member!.roles.add(roleId)
        interaction.reply({
            content: "Role added!",
            ephemeral: true
        })
    }

}