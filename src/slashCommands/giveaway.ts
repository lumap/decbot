import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import BotClient from "../classes/Client";
import timestampToMs from "timestamp-to-ms"

export async function execute(interaction: CommandInteraction, client: BotClient) {
    //@ts-ignore
    if (!interaction.member?.permissions.has("MANAGE_GUILD")) {
        return interaction.reply({
            ephemeral: true,
            content: "You're not allowed to do this!"
        })
    }
    switch (interaction.options.getSubcommand()) {
        case "create": {
            await interaction.deferReply({
                ephemeral: true
            });
            const title = interaction.options.getString("title")!,
                description = interaction.options.getString("description") || "Join the giveaway by clicking the button below!",
                length = interaction.options.getString("length")!,
                channelId = interaction.options.getChannel("channel")?.id || interaction.channel!.id;
            if (title.length > 256) {
                interaction.editReply({
                    content: "Title too long! Should be 256 characters max"
                });
                return;
            }
            if (description.length > 4096) {
                interaction.editReply({
                    content: "Description too long! Should be 4096 characters max"
                });
                return;
            }
            let giveaway: giveaway;
            try {
                giveaway = {
                    title: title,
                    description: description,
                    channel: channelId,
                    unix: Date.now() + timestampToMs(length),
                    entrants: [],
                    ended: false
                }
            } catch {
                interaction.editReply({
                    content: "Length invalid"
                })
                return;
            }
            let msg: Message;
            try {
                const channel = await interaction.guild!.channels.fetch(channelId);
                if (!channel!.isText()) {
                    return Error();
                }
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(title)
                    .setDescription(`${description}\n\nEnds: <t:${Math.round(giveaway.unix / 1000)}:F>`)
                msg = await channel.send({
                    content: "You should see this being edited soon:tm:"
                });
                const row = new MessageActionRow()
                    .addComponents([
                        new MessageButton()
                            .setCustomId("giveaway-" + msg.id)
                            .setLabel("Join!")
                            .setStyle("SUCCESS")
                    ])
                msg.edit({
                    embeds: [embed],
                    components: [row],
                    content: `Join below this giveaway created by ${interaction.user}!`
                })
            } catch {
                interaction.editReply({
                    content: "Couldn't send the giveaway message. Please make sure I have the correct permissions.",
                });
                return;
            }

            client.db.set("giveaways." + msg.id, giveaway)
            interaction.editReply({
                content: "Giveaway succesfully created! (hopefully)"
            })
            break;
        }
        case "end": {
            const id = interaction.options.getString("id")!, giveaway: giveaway = client.db.get("giveaways." + id);
            if (!giveaway) {
                return interaction.reply({
                    content: "Nah m8 this giveaway doesnt exist",
                    ephemeral: true
                })
            }
            if (giveaway.ended == true) {
                return interaction.reply({
                    content: "Giveaway already ended",
                    ephemeral: true
                })
            }
            await interaction.deferReply({ ephemeral: true })
            const channel = await client.channels.fetch(giveaway.channel);
            if (!channel || !channel.isText()) return;
            const msg = await channel.messages.fetch(id);
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(giveaway.title)
                .setDescription(`${giveaway.description}\n\n**Ended!**`)
            msg.edit({
                embeds: [embed],
                components: [],
                content: "Giveaway ended!"
            })
            if (!giveaway.entrants[0]) {
                channel.send({
                    content: "No one joined...",
                    reply: {
                        messageReference: id
                    }
                }).then().catch(() => { })
            } else {
                channel.send({
                    content: `Ok, so I went through all **${giveaway.entrants.length}** participants, and I had to pick a winner... The winner is <@${giveaway.entrants[Math.round(Math.random() * giveaway.entrants.length)]}>!!!!!!`,
                    reply: {
                        messageReference: id
                    }
                }).then().catch(() => { })
            }
            client.db.set(`giveaways.${id}.ended`, true)
            interaction.editReply({
                content: "Done or something"
            })
            break;
        }
        case "reroll": {
            const id = interaction.options.getString("id")!, giveaway: giveaway = client.db.get("giveaways." + id);
            if (!giveaway) {
                return interaction.reply({
                    content: "Nah m8 this giveaway doesnt exist",
                    ephemeral: true
                })
            }
            if (!giveaway.ended) {
                return interaction.reply({
                    content: "Can't reroll a non ended giveaway duh",
                    ephemeral: true
                })
            }
            await interaction.deferReply({ ephemeral: true });
            try {
                const channel = await interaction.guild!.channels.fetch(giveaway.channel);
                if (!channel?.isText()) {
                    throw Error();
                }
                channel.send({
                    content: `It looks like ${interaction.user} rerolled this giveaway... The new winner is <@${giveaway.entrants[Math.round(Math.random() * giveaway.entrants.length)]}>, pog!`,
                    reply: {
                        messageReference: id
                    }
                })
            } catch {
                interaction.editReply({
                    content: "can't send message man"
                })
                return;
            }
            interaction.editReply({
                content: "should be done idk"
            })
            break;
        }
    }
}