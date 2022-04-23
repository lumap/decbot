import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export async function execute(interaction: CommandInteraction, client: BotClient) {
    //@ts-ignore
    if (!interaction.member?.permissions.has("MANAGE_GUILD")) {
        return interaction.reply({
            ephemeral: true,
            content: "You're not allowed to do this!"
        })
    }
    switch (interaction.options.getSubcommand()) {
        case "set": {
            client.db.set(`coins.${interaction.guildId}.${interaction.options.getUser("user")!.id}`, interaction.options.getNumber("coins")! * 100)
            interaction.reply({
                ephemeral: true,
                content: "Success"
            })
            break;
        }
        case "remove": {
            client.db.substract(`coins.${interaction.guildId}.${interaction.options.getUser("user")!.id}`, interaction.options.getNumber("coins")! * 100)
            interaction.reply({
                ephemeral: true,
                content: "Success"
            })
            break;
        }
        case "add": {
            client.db.add(`coins.${interaction.guildId}.${interaction.options.getUser("user")!.id}`, interaction.options.getNumber("coins")! * 100)
            interaction.reply({
                ephemeral: true,
                content: "Success"
            })
            break;
        }
        default: {
            break;
        }
    }
}