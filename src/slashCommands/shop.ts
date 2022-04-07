import { CommandInteraction, MessageEmbed } from "discord.js";
import { config } from "../../config";
import BotClient from "../classes/Client";

export async function execute(interaction: CommandInteraction, client: BotClient) {
    switch (interaction.options.getSubcommand()) {
        case "add": { //@ts-ignore
            if (!interaction.member.roles.cache.has(config.modRole)) {
                return interaction.reply({
                    ephemeral: true,
                    content: "You're not allowed to do this!"
                })
            }
            const name = interaction.options.getString("name");
            if (!client.db.get("items")) client.db.set("items", {});
            if (Object.keys(client.db.get("items")).length == 25) return interaction.reply({
                content: "Sorry, but there's too much items in the shop.Please remove one.",
                ephemeral: true
            })
            if (!!client.db.get(`items.${name}`)) return interaction.reply({
                content: "An item with this name already exists.",
                ephemeral: true
            })
            client.db.set(`items.${name}`, {
                price: interaction.options.getInteger("price"),
                description: interaction.options.getString("description"),
                quantity: interaction.options.getInteger("quantity") || -1
            })
            interaction.reply({
                content: "Item successfully added!",
                ephemeral: true
            })
            break;
        };
        case "delete": { //@ts-ignore
            if (!interaction.member.roles.cache.has(config.modRole)) {
                return interaction.reply({
                    ephemeral: true,
                    content: "You're not allowed to do this!"
                })
            }
            const name = interaction.options.getString("name");
            if (!client.db.get(`items.${name}`)) return interaction.reply({
                content: "There is no items with this name.",
                ephemeral: true
            })
            client.db.delete(`items.${name}`);
            interaction.reply({
                content: "Item successfully deleted!",
                ephemeral: true
            })
            break;
        };
        case "buy": {
            const name = interaction.options.getString("name");
            if (!client.db.get(`items.${name}`)) return interaction.reply({
                content: "There is no items with this name.",
                ephemeral: true
            })
            if (client.db.get("coins." + interaction.user.id) < client.db.get(`items.${name}.price`) * 100) {
                return interaction.reply({
                    content: "You are too broke to buy this!",
                    ephemeral: true
                })
            }
            client.db.set("coins." + interaction.user.id, client.db.get("coins." + interaction.user.id) - client.db.get(`items.${name}.price`) * 100)
            if (client.db.get(`items.${name}.quantity`) != -1) {
                if (client.db.get(`items.${name}.quantity`) - 1 === 0) {
                    client.db.delete(`items.${name}`);
                } else {
                    client.db.set(`items.${name}.quantity`, parseInt(`items.${name}.quantity`) - 1)
                }
            }
            interaction.reply({
                content: "Item **" + name + "** successfully bought! If the item requires any mod help (an emoji slot), please go to <#937827035177422929>.",
                ephemeral: true
            })
            const channel = await client.channels.fetch("940291076516888656");
            if (!channel || !channel.isText()) return;
            channel.send(`<@${interaction.user.id}> bought the item **${name}**`)
            break;
        };
        case "items": {
            const items = client.db.get("items");
            let list = [];
            for (const [key, value] of Object.entries(items)) { //@ts-ignore
                list.push({ inline: true, name: key, value: `**Description**: ${value.description}\n**Price**:${value.price}\n**Quantity**: ${value.quantity == -1 ? "Unlimited" : value.quantity}` })
            }
            let embed = new MessageEmbed()
                .setColor("BLURPLE")
                .setTitle("Shop")
                .setDescription("Here, you can find all the available shop items.")
                .setFields(list)
            interaction.reply({
                ephemeral: true,
                embeds: [embed]
            })
            break;
        }
        default: {
            console.log("oopsie happened");
            break;
        }
    }
}