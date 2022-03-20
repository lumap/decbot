import { CommandInteraction } from "discord.js";

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    let ev = interaction.options.getString("code") || ""; //@ts-ignore
    try { ev = eval(ev) } catch (e) { ev = e };
    interaction.editReply("```js\n" + ev + "```");
}