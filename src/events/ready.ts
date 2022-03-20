import BotClient from "../classes/Client";
import {setActivity} from "../functions/setActivity"

export function event(client: BotClient) {
        console.log('Ready!');
        setActivity(client)
        setInterval(setActivity, 1800000, client)
}