"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
function execute(interaction, client) {
    const amount = interaction.options.getNumber("count"), user = interaction.options.getUser("user");
    if (!amount || !user)
        return;
    if ((client.db.get("coins." + interaction.user.id) / 100 < amount) || Math.floor(amount * 100) <= 0)
        return interaction.reply({
            content: "You do not have enough coins!",
            ephemeral: true
        });
    if (interaction.user.id === user.id || user.bot) {
        return interaction.reply({
            content: "no",
            ephemeral: true
        });
    }
    client.db.subtract("coins." + interaction.user.id, Math.floor(amount * 100));
    client.db.add("coins." + user.id, Math.floor(amount * 100));
    interaction.reply({
        content: `${interaction.member} successfully gave **${amount}** coins to ${user}`
    });
}
exports.execute = execute;
