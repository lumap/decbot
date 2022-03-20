"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msButtons = void 0;
const discord_js_1 = require("discord.js");
exports.msButtons = new discord_js_1.MessageActionRow()
    .addComponents([
    new discord_js_1.MessageButton()
        .setCustomId('ms-flag')
        .setLabel('Flag')
        .setStyle("SUCCESS"),
    new discord_js_1.MessageButton()
        .setCustomId('ms-unflag')
        .setLabel("Unflag")
        .setStyle("SUCCESS"),
    new discord_js_1.MessageButton()
        .setCustomId('ms-reveal')
        .setLabel('Reveal')
        .setStyle("SUCCESS"),
    new discord_js_1.MessageButton()
        .setCustomId('ms-stop-game')
        .setLabel('End the game')
        .setStyle("DANGER"),
]);
