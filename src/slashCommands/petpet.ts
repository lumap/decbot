import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";
import petpet from 'pet-pet-gif';

export async function execute(interaction: CommandInteraction, _client: BotClient) {
    await interaction.deferReply();
    let user = interaction.options.getUser("user")!;
    let gif: Buffer = await petpet(user.avatarURL({ format: "png", size: 1024 }));
    interaction.editReply({
        files: [
            {
                attachment: gif,
                name: "pet.gif",
                description: "Pet!"
            }
        ]
    });
}