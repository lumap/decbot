import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export function execute(interaction: CommandInteraction, client: BotClient) {
    if (!client.minesweeperGames.get(interaction.user.id)) {
        return interaction.reply({
            content: "You do not have any ongoing game!",
            ephemeral: true
        })
    }
    client.minesweeperGames.delete(interaction.user.id)
    interaction.reply({
        content: "Ok... Do `/minesweeper` to start a game.",
        ephemeral: true
    })
}