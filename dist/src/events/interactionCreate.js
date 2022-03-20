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
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discordModals = __importStar(require("discord-modals"));
const renderGrid_1 = require("../functions/renderGrid");
const msButtons_1 = require("../constants/msButtons");
function event(interaction, client) {
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return console.log(interaction.commandName);
        cmd.execute(interaction, client);
    }
    else if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'ms-start': {
                interaction.update({
                    content: (0, renderGrid_1.renderGrid)(client.minesweeperGames.get(interaction.user.id), false),
                    components: [msButtons_1.msButtons],
                });
                break;
            }
            case 'ms-cancel': {
                interaction.update({ content: "Ok...", components: [] });
                client.minesweeperGames.delete(interaction.user.id);
                break;
            }
            case 'ms-flag': {
                const flagModal = new discordModals.Modal()
                    .setCustomId('ms-flag')
                    .setTitle('Interact with the grid');
                flagModal.components = [
                    new discordModals.TextInputComponent()
                        .setCustomId('ms-box')
                        .setLabel('Which tile do you want to flag?')
                        .setStyle('SHORT')
                        .setMinLength(2)
                        .setMaxLength(2)
                        .setPlaceholder('a1')
                        .setRequired(true)
                ];
                discordModals.showModal(flagModal, {
                    client: client,
                    interaction: interaction
                });
                break;
            }
            case 'ms-unflag': {
                const unflagModal = new discordModals.Modal()
                    .setCustomId('ms-unflag')
                    .setTitle('Interact with the grid');
                unflagModal.components = [
                    new discordModals.TextInputComponent()
                        .setCustomId('ms-box')
                        .setLabel('Which tile do you want to unflag?')
                        .setStyle('SHORT')
                        .setMinLength(2)
                        .setMaxLength(2)
                        .setPlaceholder('a1')
                        .setRequired(true)
                ];
                discordModals.showModal(unflagModal, {
                    client: client,
                    interaction: interaction
                });
                break;
            }
            case 'ms-reveal': {
                const revealModal = new discordModals.Modal()
                    .setCustomId('ms-reveal')
                    .setTitle('Interact with the grid');
                revealModal.components = [new discordModals.TextInputComponent()
                        .setCustomId('ms-box')
                        .setLabel('What do you want to reveal?')
                        .setStyle('SHORT')
                        .setMinLength(2)
                        .setMaxLength(2)
                        .setPlaceholder('a1')
                        .setRequired(true)
                ];
                discordModals.showModal(revealModal, {
                    client: client,
                    interaction: interaction
                });
                break;
            }
            case 'ms-stop-game': {
                interaction.update({
                    components: [], content: (0, renderGrid_1.renderGrid)(client.minesweeperGames.get(interaction.user.id), true)
                }).then(() => client.minesweeperGames.delete(interaction.user.id));
                break;
            }
            default: {
                break;
            }
        }
    }
}
exports.event = event;
