import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import Minesweeper from "discord.js-minesweeper";
import BotClient from "../classes/Client";

export function execute(interaction: CommandInteraction, client: BotClient) {
        if (client.minesweeperGames.get(interaction.user.id)) {
            return interaction.reply({
                ephemeral: true,
                content: "You already have an ongoing game! If you wish to start a new game, please do `/minesweeper-reset`"
            })
        }
        const mines = interaction.options.getInteger("difficulty") || 7
        if (!(mines > 3 && mines < 13)) {
            return interaction.reply({
                content: "Difficulty level not valid",
                ephemeral: true
            })
        }
        const minesweeper = new Minesweeper({
            rows: 6,
            columns: 8,
            mines: mines,
            revealFirstCell: true,
            returnType: "matrix"
        }).start();
        if (!minesweeper || typeof minesweeper == "string") return;
        let revealed: string[] = []
        //clean matrix and revealed cells
        for (let i = 0; i < minesweeper.length; i++) {
            for (let j = 0; j < minesweeper[0].length; j++) {
                minesweeper[i][j] = minesweeper[i][j].replaceAll(" ", "");
                if (!minesweeper[i][j].includes("|")) revealed.push(`${i} ${j}`)
                minesweeper[i][j] = minesweeper[i][j].replaceAll("|", "");
                minesweeper[i][j] = minesweeper[i][j].replaceAll(":", "");
            }
        }
        client.minesweeperGames.set(interaction.user.id, {
            matrix: minesweeper,
            revealed: revealed,
            flagged: [],
            flagLimit: mines + 1,
            turn: 0,
            remainingHP: 3,
            starterID: interaction.user.id
        })
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ms-start')
                    .setLabel('Start')
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId('ms-cancel')
                    .setLabel("Cancel")
                    .setStyle("DANGER")
            );
        interaction.reply({
            content: "insert tutorial on how to play the game.\nPLEASE NOTE THAT THIS GAME IS CURRENTLY IN BETA\n\nDo you want to start the game?",
            components: [row],
            ephemeral: true
        })
}