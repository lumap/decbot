import { Client, ClientOptions } from "discord.js";
import fs from "fs";
import db from "quick.db";
import * as discordModals from "discord-modals"
import { possibleWordleSolutions } from "../constants/wordle"
import schedule from "node-schedule"

class BotClient extends Client {
    minesweeperGames: minesweeperGame;
    db: any;
    slashCommands: Map<string, { execute: Function }>;
    wordle: string;

    constructor(options: ClientOptions) {
        super(options);
        this.minesweeperGames = new Map();
        this.slashCommands = new Map()
        this.db = db;
        discordModals.default(this);
        this.wordle = ""
        this.initWordle()
    }

    async initEvents() {
        const events = fs.readdirSync(__dirname + "/../events/")
        for (const i in events) {
            let event = events[i]
            let fn = await import(`../events/${event}`)
            this.on(event.slice(0, -3), (...args) => {
                fn.event(...args, this)
            })
        }
    }

    async initSlashCommands() {
        const commands = fs.readdirSync(__dirname + "/../slashCommands/")
        for (const i in commands) {
            let cmd = commands[i]
            let fn = await import(`../slashCommands/${cmd}`)
            this.slashCommands.set(cmd.slice(0, -3), fn)
        }
    }

    initWordle() {
        let client = this;
        schedule.scheduleJob("0 0 0 * * *", function () {
            client.db.set("wordle", possibleWordleSolutions[Math.round(Math.random() * possibleWordleSolutions.length)])
            client.db.set("wordleGuessedIds", [])
            console.log("Word has been set!")
        })
    }

}


export default BotClient