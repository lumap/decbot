"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const addCoin_1 = require("../functions/addCoin");
function event(msg, client) {
    if (msg.author.bot || msg.webhookId)
        return;
    (0, addCoin_1.addCoin)(msg.author.id, 1, client);
}
exports.event = event;
