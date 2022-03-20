"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
function execute(interaction, client) {
    let user = interaction.options.getUser("user")?.id;
    if (!user) {
        return interaction.reply({
            content: `You have **${client.db.get("coins." + interaction.user.id) / 100}** coins`,
            ephemeral: true
        });
    }
    interaction.reply({
        content: `<@${user}> has **${client.db.get("coins." + user) / 100}** coins.`,
        ephemeral: true
    });
}
exports.execute = execute;
