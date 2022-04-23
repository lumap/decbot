import { CommandInteraction, MessageActionRow, MessageButton, Role } from "discord.js";
import { config } from "../../config";
import BotClient from "../classes/Client";

export async function execute(interaction: CommandInteraction, _client: BotClient) {
    //@ts-ignore
    if (!interaction.member?.permissions.has("MANAGE_GUILD")) {
        return interaction.reply({
            ephemeral: true,
            content: "You're not allowed to do this!"
        })
    }
    await interaction.deferReply({
        ephemeral: true
    });
    let role = interaction.options.getRole("role")!, msg = interaction.options.getString("message") || "Click the button below to get the corresponding role."
    const components = [
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("rr-" + role.id)
                    .setLabel(role.name)
                    .setStyle("SECONDARY"),
            ),
    ]
    let additionalRoles: Role[] = [];
    for (let i = 2; i < 11; i++) {
        if (interaction.options.getRole("role-" + i)) { //@ts-ignore
            additionalRoles.push(interaction.options.getRole("role-" + i))
        }
    }
    for (let i = 0; i < additionalRoles.length; i++) {
        const lastComp = components[components.length - 1];
        if (lastComp.components.length < 5) {
            lastComp.addComponents(
                new MessageButton()
                    .setCustomId("rr-" + additionalRoles[i].id)
                    .setLabel(additionalRoles[i].name)
                    .setStyle("SECONDARY")
            );
        } else {
            components.push(
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("rr-" + additionalRoles[i].id)
                            .setLabel(additionalRoles[i].name)
                            .setStyle("SECONDARY")
                    )
            )
        }
    }
    await interaction.channel!.send({
        content: msg,
        components: components
    })
    interaction.editReply({
        content: "Created!",
    })
}