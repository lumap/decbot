import { Message } from "discord.js";
import BotClient from "../classes/Client";
import { addCoin } from "../functions/addCoin";

export function event(msg: Message, client: BotClient) {
    if (msg.author.bot || msg.webhookId) return;
    addCoin(msg.author.id, 1, client);
}