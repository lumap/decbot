import BotClient from "./classes/Client";
import * as Discord from "discord.js"
import { config } from "../config"

const client = new BotClient({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS]
})

client.initEvents()

client.login(config.token)