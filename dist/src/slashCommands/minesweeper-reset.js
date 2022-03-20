"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
function execute(interaction, client) {
    if (!client.minesweeperGames.get(interaction.user.id)) {
        return interaction.reply({
            content: "You do not have any ongoing game!",
            ephemeral: true
        });
    }
    client.minesweeperGames.delete(interaction.user.id);
    interaction.reply({
        content: "Ok... Do `/minesweeper` to start a game.",
        ephemeral: true
    });
}
exports.execute = execute;
