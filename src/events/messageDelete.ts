import { Message } from "discord.js";
import BotClient from "../classes/Client";

export function event(msg: Message, client: BotClient) {
    client.db.delete(`giveaways.${msg.id}`)
}