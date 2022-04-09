import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";
import petpet from 'pet-pet-gif';

export async function execute(interaction: CommandInteraction, _client: BotClient) {
    let user = interaction.options.getUser("user")!;
    function getRandomPhrase(): string {
        const list = [`no fucking way\n${user} got a pat from ${interaction.user}`, `${user} got patted by ${interaction.user}\nthis is a pog moment`, `NO SHIT FART FUCK WAY ${user} JUST GOT PET BY ${interaction.user} THE ATTRACTION IS BOOMING`, `${user} got pet by ${interaction.user}\nBe sure to share some with Niko`, `<https://www.youtube.com/watch?v=dQw4w9WgXcQ>`];
        return list[Math.floor(Math.random() * list.length)]
    }
    await interaction.deferReply();
    let gif: Buffer = await petpet(user.avatarURL({ format: "png", size: 1024 }));
    interaction.editReply({
        content: getRandomPhrase(),
        files: [
            {
                attachment: gif,
                name: "pet.gif",
                description: "Pet!"
            }
        ]
    });
}