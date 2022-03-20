"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
async function execute(interaction) {
    await interaction.deferReply();
    let ev = interaction.options.getString("code") || ""; //@ts-ignore
    try {
        ev = eval(ev);
    }
    catch (e) {
        ev = e;
    }
    ;
    interaction.editReply("```js\n" + ev + "```");
}
exports.execute = execute;
