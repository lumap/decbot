import { CommandInteraction, MessageEmbed } from "discord.js";
import { config } from "../../config";
import BotClient from "../classes/Client";

export async function execute(interaction: CommandInteraction, client: BotClient) {
    switch (interaction.options.getSubcommand()) {
        case "add": { //@ts-ignore
            if (!interaction.member?.permissions.has("MANAGE_GUILD")) {
                return interaction.reply({
                    ephemeral: true,
                    content: "You're not allowed to do this!"
                })
            }
            const name = interaction.options.getString("name");
            if (!client.db.get("shop." + interaction.guild!.id)) client.db.set("shop." + interaction.guild!.id, {});
            if (Object.keys(client.db.get("shop." + interaction.guild!.id)).length == 25) return interaction.reply({
                content: "Sorry, but there's too much items in the shop.Please remove one.",
                ephemeral: true
            })
            if (!!client.db.get(`shop.${interaction.guild!.id}.${name}`)) return interaction.reply({
                content: "An item with this name already exists.",
                ephemeral: true
            })
            client.db.set(`shop.${interaction.guild!.id}.${name}`, {
                price: interaction.options.getInteger("price"),
                description: interaction.options.getString("description"),
                quantity: interaction.options.getInteger("quantity") || -1,
                role: interaction.options.getRole("role")?.id || null
            })
            interaction.reply({
                content: "Item successfully added!",
                ephemeral: true
            })
            break;
        };
        case "delete": { //@ts-ignore
            if (!interaction.member?.permissions.has("MANAGE_GUILD")) {
                return interaction.reply({
                    ephemeral: true,
                    content: "You're not allowed to do this!"
                })
            }
            const name = interaction.options.getString("name");
            if (!client.db.get(`shop.${interaction.guild!.id}.${name}`)) return interaction.reply({
                content: "There is no items with this name.",
                ephemeral: true
            })
            client.db.delete(`shop.${interaction.guild!.id}.${name}`);
            interaction.reply({
                content: "Item successfully deleted!",
                ephemeral: true
            })
            break;
        };
        case "buy": {
            const name = interaction.options.getString("name");
            if (!client.db.get(`shop.${interaction.guild!.id}.${name}`)) return interaction.reply({
                content: "There is no items with this name.",
                ephemeral: true
            })
            if (client.db.get(`coins.${interaction.guildId}.${interaction.user.id}`) < client.db.get(`shop.${interaction.guild!.id}.${name}.price`) * 100) {
                return interaction.reply({
                    content: "You are too broke to buy this!",
                    ephemeral: true
                })
            }
            client.db.set(`coins.${interaction.guildId}.${interaction.user.id}`, client.db.get(`coins.${interaction.guildId}.${interaction.user.id}`) - client.db.get(`shop.${interaction.guild!.id}.${name}.price`) * 100)
            if (client.db.get(`shop.${interaction.guild!.id}.${name}.role`)) { //@ts-ignore
                interaction.member?.roles.add(client.db.get(`shop.${interaction.guild!.id}.${name}.role`))
            }
            if (parseInt(client.db.get(`shop.${interaction.guild!.id}.${name}.quantity`)) != -1) {
                if (parseInt(client.db.get(`shop.${interaction.guild!.id}.${name}.quantity`)) - 1 < 1) {
                    client.db.delete(`shop.${interaction.guild!.id}.${name}`);
                } else {
                    client.db.set(`shop.${interaction.guild!.id}.${name}.quantity`, parseInt(`shop.${interaction.guild!.id}.${name}.quantity`) - 1)
                }
            }
            interaction.reply({
                content: "Item **" + name + "** successfully bought! If you just bought a role, you should now have it.",
                ephemeral: true
            })
            if (interaction.guild!.id === "932099452771123210") {
                const channel = await client.channels.fetch("940291076516888656");
                if (!channel || !channel.isText()) return;
                channel.send(`<@${interaction.user.id}> bought the item **${name}**`)
            }
            break;
        };
        case "items": {
            const items = client.db.get("shop." + interaction.guild!.id);
            let list = [];
            for (const [key, value] of Object.entries(items)) { //@ts-ignore
                list.push({ name: key, value: `**Description**: ${value.description}\n**Price**:${value.price}\n**Quantity**: ${value.quantity == -1 ? "Unlimited" : value.quantity}${value.role ? `\n**Role**: <@&${value.role}>` : ""}` })
            }
            let embed = new MessageEmbed()
                .setColor("BLURPLE")
                .setTitle("Shop")
                .setDescription("Here, you can find all the available shop shop.")
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