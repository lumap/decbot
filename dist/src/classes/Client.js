"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const quick_db_1 = __importDefault(require("quick.db"));
const discordModals = __importStar(require("discord-modals"));
class BotClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.minesweeperGames = new Map();
        this.slashCommands = new Map();
        this.db = quick_db_1.default;
        discordModals.default(this);
    }
    async initEvents() {
        const events = fs_1.default.readdirSync(__dirname + "/../events/");
        for (const i in events) {
            let event = events[i];
            let fn = await Promise.resolve().then(() => __importStar(require(`../events/${event}`)));
            this.on(event.slice(0, -3), (...args) => {
                fn.event(...args, this);
            });
        }
    }
    async initSlashCommands() {
        const commands = fs_1.default.readdirSync(__dirname + "/../slashCommands/");
        for (const i in commands) {
            let cmd = commands[i];
            let fn = await Promise.resolve().then(() => __importStar(require(`../slashCommands/${cmd}`)));
            this.slashCommands.set(cmd.slice(0, -3), fn);
        }
    }
}
exports.default = BotClient;
