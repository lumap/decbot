import BotClient from "../classes/Client";

export function setActivity(client: BotClient) {
    client.user!.setActivity("may not work")
}