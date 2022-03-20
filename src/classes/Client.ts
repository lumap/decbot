import { Client, ClientOptions } from "discord.js";
import fs from "fs";
import db from "quick.db";
import * as discordModals from "discord-modals"


class BotClient extends Client {
    minesweeperGames: minesweeperGame;
    db: any;
    slashCommands: Map<string,{execute: Function}>

    constructor(options: ClientOptions) {
        super(options);
        this.minesweeperGames = new Map();
        this.slashCommands = new Map()
        this.db = db;
        discordModals.default(this);
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
            let fn = await import(`../slashCommands/${cmd}`)
            this.slashCommands.set(cmd.slice(0, -3),fn)
        }
    }

}


export default BotClient