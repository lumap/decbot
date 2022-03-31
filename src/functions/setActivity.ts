import BotClient from "../classes/Client";

export function setActivity(client: BotClient) {
    client.user!.setActivity("I'm more floofy than World Machine~")
}