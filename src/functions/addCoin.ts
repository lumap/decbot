import BotClient from "../classes/Client";
import { announceCoins } from "../constants/announceCoinsChannel";

export async function addCoin(id: string, amount: number, client: BotClient) {
    const coins = client.db.get("coins." + id)
    if (!coins) {
        client.db.set("coins." + id, Math.floor(amount))
    }
    if (Math.floor(coins / 100) < Math.floor(coins / 100 + amount / 100)) {
        const channel = await client.channels.fetch(announceCoins);
        if (!channel || !channel.isText()) return;
        channel.send({
            content: `<@${id}> just got **1** more DECoin! Their total coin count now is **${Math.floor(coins / 100 + amount / 100)}**!`,
            allowedMentions: { parse: [] }
        })
    }
    client.db.add("coins." + id, amount)
}