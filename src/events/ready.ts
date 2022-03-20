import BotClient from "../classes/Client";
import { setActivity } from "../functions/setActivity"
import date from "../main"

export function event(client: BotClient) {
        console.log("Ready! Took " + (Date.now() - date) + "ms");
        setActivity(client)
        setInterval(setActivity, 1800000, client)
}