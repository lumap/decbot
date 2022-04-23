import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";
import { config } from "../../config"

export async function execute(interaction: CommandInteraction, _client: BotClient) {
    //@ts-ignore
    if (!interaction.member?.permissions.has("BAN_MEMBERS")) {
        return interaction.reply({
            content: "No.",
            ephemeral: true
        })
    }
    let reason = interaction.options.getString("reason"), user = interaction.options.getUser("user")!;
    if (interaction.guild?.members.cache.get(user.id)!.roles.cache.has(config.modRole)) {
        return interaction.reply({
            content: "Can't ban a mod...",
            ephemeral: true
        })
    }
    await interaction.deferReply();
    try {
        await user.send(`You've been banned from **${interaction.guild!.name}**${reason ? " for the following reason: " + reason : ""}.${interaction.guild!.id == "932099452771123210" ? " If you wish to appeal your ban, fill out this form: ${config.unbanAppealForm}" : ""}`)
    } catch {
        "Couldn't DM member."
    }
    await interaction.guild?.members.ban(user, {
        days: 7,
        reason: `Banned by ${interaction.user.tag} for reason: ` + reason || "No reason specified"
    })
    interaction.editReply({
        content: `Banned <@${user.id}> succesfully.`
    });
}