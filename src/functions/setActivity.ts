import BotClient from "../classes/Client";

export function setActivity(client: BotClient) {
    client.user!.setActivity("with your mom")
}