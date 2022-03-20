"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const setActivity_1 = require("../functions/setActivity");
function event(client) {
    console.log('Ready!');
    (0, setActivity_1.setActivity)(client);
    setInterval(setActivity_1.setActivity, 1800000, client);
}
exports.event = event;
