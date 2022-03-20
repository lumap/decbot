import { MessageActionRow, MessageButton } from "discord.js";

export const msButtons = new MessageActionRow()
    .addComponents([
        new MessageButton()
            .setCustomId('ms-flag')
            .setLabel('Flag')
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId('ms-unflag')
            .setLabel("Unflag")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId('ms-reveal')
            .setLabel('Reveal')
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId('ms-stop-game')
            .setLabel('End the game')
            .setStyle("DANGER"),
    ]);