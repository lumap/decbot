import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export function execute(interaction: CommandInteraction, client: BotClient) {
    const mode = interaction.options.getString("mode")!
    if (mode == "daily") {

    } else if (mode == "unlimited") {
        
    }
}