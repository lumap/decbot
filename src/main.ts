import BotClient from "./classes/Client";
import * as Discord from "discord.js"
import { config } from "../config"

console.log("Booting...")
let date = Date.now();

export default date

const client = new BotClient({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS],
    ws: { properties: { $browser: "Discord iOS" } }
})

client.initEvents()
client.initSlashCommands()
client.initButtonHandlers()

client.login(config.token)

async function checkGiveaways() {
    const giveaways: any[] = Object.entries(client.db.get("giveaways"));
    for (let i = 0; i < giveaways.length; i++) {
        const id = giveaways[i][0], giveaway: giveaway = giveaways[i][1]
        if (giveaway.ended == false && giveaway.unix < Date.now()) {
            const channel = await client.channels.fetch(giveaway.channel);
            if (!channel || !channel.isText()) return;
            let msg;
            try {
                msg = await channel.messages.fetch(id);
            } catch {
                client.db.delete(`giveaways.${id}`);
                return;
            }
            if (!giveaway.entrants[0]) {
                channel.send({
                    content: "No one joined...",
                    reply: {
                        messageReference: id
                    }
                }).then().catch(() => { })
            } else {
                channel.send({
                    content: `Ok, so I went through all **${giveaway.entrants.length}** participants, and I had to pick a winner... The winner is <@${giveaway.entrants[Math.round(Math.random() * giveaway.entrants.length)]}>!!!!!`,
                    reply: {
                        messageReference: id
                    }
                }).then().catch(() => { })
            }
            giveaway.ended = true;
            let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(giveaway.title)
                .setDescription(`${giveaway.description}\n\n**Ended!**`)
            msg.edit({
                embeds: [embed],
                components: [],
                content: "Giveaway ended!"
            })
            client.db.set("giveaways." + id, giveaway)
        }
    }
}
setInterval(checkGiveaways, 60000)
setTimeout(checkGiveaways, 5000)