import { Message } from "discord.js";
import BotClient from "../classes/Client";

export function event(msg: Message, client: BotClient) {
    if (msg.author.bot || msg.webhookId) return;
    client.addCoin(msg.author.id, 1);
}