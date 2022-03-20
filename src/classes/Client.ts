import { Client, ClientOptions } from "discord.js";
import fs from "fs";
import db from "quick.db";
import { announceCoins }  from "../constants"

class BotClient extends Client {
    minesweeperGames: minesweeperGame;
    db: any;
    slashCommands: Map<string,any>

    constructor(options: ClientOptions) {
        super(options);
        this.minesweeperGames = new Map();
        this.slashCommands = new Map()
        this.db = db;
    }

    async initEvents() {
        const events = fs.readdirSync(__dirname + "/../events/")
        for (const i in events) {
            let event = events[i]
            let fn = await import(`../events/${event}`)
            this.on(event.slice(0, -3), (...args) => {
                fn.event(...args,this)
            })
        }
    }

    async initSlashCommands() {
        const commands = fs.readdirSync(__dirname + "/../slashCommands/")
        for (const i in commands) {
            let cmd = commands[i]
            
        }
    }

    async addCoin(id: string, amount: number) {
    const coins = db.get("coins." + id)
    if (!coins) {
        db.set("coins." + id, Math.floor(amount))
    }
    if (Math.floor(coins / 100) < Math.floor(coins / 100 + amount / 100)) {
        const channel = await this.channels.fetch(announceCoins);
        if (!channel || !channel.isText()) return;
        channel.send({
            content: `<@${id}> just got **1** more coin! Their total coin count now is **${Math.floor(coins / 100 + amount / 100)}**!`,
            allowedMentions: { parse: [] }
        })
    }
    db.add("coins." + id, amount)
}
}


export default BotClient