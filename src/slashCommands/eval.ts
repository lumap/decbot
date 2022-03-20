import { CommandInteraction } from "discord.js";
import BotClient from "../classes/Client";

export async function execute(interaction: CommandInteraction, _client: BotClient) {
    await interaction.deferReply();
    let ev = interaction.options.getString("code") || ""; //@ts-ignore
    try { ev = eval(ev) } catch (e) { ev = e };
    interaction.editReply("```js\n" + ev + "```");
}