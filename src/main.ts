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