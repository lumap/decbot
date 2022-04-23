import BotClient from "../classes/Client";

export async function addCoin(guildId: string, userId: string, amount: number, client: BotClient) {
    const coins = client.db.get(`coins.${guildId}.${userId}`)
    if (!coins) {
        client.db.set(`coins.${guildId}.${userId}`, Math.floor(amount))
    }
    client.db.add(`coins.${guildId}.${userId}`, amount)
}