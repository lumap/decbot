import * as Discord from "discord.js";
import db from "quick.db";
import Minesweeper from "discord.js-minesweeper";
let minesweeperGames = new Map();

import * as discordModals from "discord-modals"

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS] });
discordModals.default(client);


client.once('ready', () => {
    console.log('Ready!');
    setActivity()
    setInterval(setActivity, 1800000)
});

function setActivity() {
    client.user!.setActivity("may not work")
}

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        switch (interaction.commandName) {
            case 'eval': {
                await interaction.deferReply(); 
                let ev = interaction.options.getString("code") || ""; //@ts-ignore
                try { ev = eval(ev) } catch (e) { ev = e };
                interaction.editReply("```js\n" + ev + "```");
                break;
            };
            case 'coins': {
                let user = interaction.options.getUser("user")?.id;
                if (!user) {
                    return interaction.reply({
                        content: `You have **${db.get("coins." + interaction.user.id) / 100}** coins`,
                        ephemeral: true
                    })
                }
                interaction.reply({
                    content: `<@${user}> has **${db.get("coins." + user) / 100}** coins.`,
                    ephemeral: true
                })
                break;
            };
            case 'shop': { 
                switch (interaction.options.getSubcommand()) {
                    case 'add': { //@ts-ignore
                        if (!interaction.member.roles.cache.has("932115827937923102")) {
                            return interaction.reply({
                                ephemeral: true,
                                content: "You're not allowed to do this!"
                            })
                        }
                        const name = interaction.options.getString("name");
                        if (!db.get("items")) db.set("items", {});
                        if (Object.keys(db.get("items")).length == 25) return interaction.reply({
                            content: "Sorry, but there's too much items in the shop. Please remove one.",
                            ephemeral: true
                        })
                        if (!!db.get(`items.${name}`)) return interaction.reply({
                            content: "An item with this name already exists.",
                            ephemeral: true
                        })
                        db.set(`items.${name}`, {
                            price: interaction.options.getInteger("price"),
                            description: interaction.options.getString("description"),
                            quantity: interaction.options.getInteger("quantity") || -1
                        })
                        interaction.reply({
                            content: "Item successfully added!",
                            ephemeral: true
                        })
                        break;
                    };
                    case 'delete': { //@ts-ignore
                        if (!interaction.member.roles.cache.has("932115827937923102")) {
                            return interaction.reply({
                                ephemeral: true,
                                content: "You're not allowed to do this!"
                            })
                        }
                        const name = interaction.options.getString("name");
                        if (!db.get(`items.${name}`)) return interaction.reply({
                            content: "There is no items with this name.",
                            ephemeral: true
                        })
                        db.delete(`items.${name}`);
                        interaction.reply({
                            content: 'Item successfully deleted!',
                            ephemeral: true
                        })
                        break;
                    };
                    case 'buy': {
                        const name = interaction.options.getString("name");
                        if (!db.get(`items.${name}`)) return interaction.reply({
                            content: "There is no items with this name.",
                            ephemeral: true
                        })
                        if (db.get("coins." + interaction.user.id) < db.get(`items.${name}.price`) * 100) {
                            return interaction.reply({
                                content: "You are too broke to buy this!",
                                ephemeral: true
                            })
                        }
                        db.set("coins." + interaction.user.id, db.get("coins." + interaction.user.id) - db.get(`items.${name}.price`) * 100)
                        if (db.get(`items.${name}.quantity`) != -1) {
                            if (db.get(`items.${name}.quantity`) - 1 === 0) {
                                db.delete(`items.${name}`);
                            } else {
                                db.set(`items.${name}.quantity`, parseInt(`items.${name}.quantity`) - 1)
                            }
                        }
                        interaction.reply({
                            content: "Item **" + name + "** successfully bought! If the item requires any mod help (an emoji slot), please go to <#937827035177422929>.",
                            ephemeral: true
                        })
                        const channel = await client.channels.fetch("940291076516888656");
                        if (!channel || !channel.isText()) return;
                        channel.send(`<@${interaction.user.id}> bought the item **${name}**`)
                        break;
                    };
                    case 'items': {
                        const items = db.get("items");
                        let list = [];
                        for (const [key, value] of Object.entries(items)) { //@ts-ignore
                            list.push({ inline: true, name: key, value: `**Description**: ${value.description}\n**Price**:${value.price}\n**Quantity**: ${value.quantity == -1 ? "Unlimited" : value.quantity}` })
                        }
                        let embed = new Discord.MessageEmbed()
                            .setColor("BLURPLE")
                            .setTitle("Shop")
                            .setDescription("Here, you can find all the available shop items.")
                            .setFields(list)
                        interaction.reply({
                            ephemeral: true,
                            embeds: [embed]
                        })
                        break;
                    }
                    default: {
                        console.log("oopsie happened");
                        break;
                    }
                }
                break;
            }
            case 'give': {
                const amount = interaction.options.getNumber("count"), user = interaction.options.getUser("user");
                if (!amount || !user) return;
                if ((db.get("coins." + interaction.user.id) / 100 < amount) || Math.floor(amount * 100) <= 0) return interaction.reply({
                    content: "You do not have enough coins!",
                    ephemeral: true
                });
                if (interaction.user.id === user.id || user.bot) {
                    return interaction.reply({
                        content: "no",
                        ephemeral: true
                    })
                }
                db.subtract("coins." + interaction.user.id, Math.floor(amount * 100))
                db.add("coins." + user.id, Math.floor(amount * 100))
                interaction.reply({
                    content: `${interaction.member} successfully gave **${amount}** coins to ${user}`
                })
                break;
            }
            case 'minesweeper': {
                if (minesweeperGames.get(interaction.user.id)) {
                    return interaction.reply({
                        ephemeral: true,
                        content: "You already have an ongoing game! If you wish to start a new game, please do `/minesweeper-reset`"
                    })
                }
                const mines = interaction.options.getInteger("difficulty") || 7
                if (!(mines > 3 && mines < 13)) {
                    return interaction.reply({
                        content: "Difficulty level not valid",
                        ephemeral: true
                    })
                }
                const minesweeper = new Minesweeper({
                    rows: 6,
                    columns: 8,
                    mines: mines,
                    revealFirstCell: true,
                    returnType: "matrix"
                }).start();
                if (!minesweeper || typeof minesweeper == "string") return;
                let revealed: string[] = []
                //clean matrix and revealed cells
                for (let i = 0; i < minesweeper.length; i++) {
                    for (let j = 0; j < minesweeper[0].length; j++) {
                        minesweeper[i][j] = minesweeper[i][j].replaceAll(" ", "");
                        if (!minesweeper[i][j].includes("|")) revealed.push(`${i} ${j}`)
                        minesweeper[i][j] = minesweeper[i][j].replaceAll("|", "");
                        minesweeper[i][j] = minesweeper[i][j].replaceAll(":", "");
                    }
                }
                minesweeperGames.set(interaction.user.id, {
                    matrix: minesweeper,
                    revealed: revealed,
                    flagged: [],
                    flagLimit: mines + 1,
                    turn: 0,
                    bombsHitRemaining: 3,
                    memberId: interaction.user.id
                })
                const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('ms-start-' + interaction.user.id)
                            .setLabel('Start')
                            .setStyle("SUCCESS"),
                        new Discord.MessageButton()
                            .setCustomId('ms-cancel-' + interaction.user.id)
                            .setLabel("Cancel")
                            .setStyle("DANGER")
                    );
                interaction.reply({
                    content: "insert tutorial on how to play the game.\nPLEASE NOTE THAT THIS GAME IS CURRENTLY IN BETA\n\nDo you want to start the game?",
                    components: [row]
                })
                break;
            }
            case 'minesweeper-reset': {
                if (!minesweeperGames.get(interaction.user.id)) {
                    return interaction.reply({
                        content: "You do not have any ongoing game!",
                        ephemeral: true
                    })
                }
                minesweeperGames.delete(interaction.user.id)
                interaction.reply({
                    content: "Ok... Do `/minesweeper` to start a game.",
                    ephemeral: true
                })
                break;
            }
            default: {
                console.log("wtf");
                break;
            }
        }
    }
    if (interaction.isButton()) {
        if (!checkMember(interaction.customId, interaction.user.id)) {
            return interaction.reply({
                content: "You're not allowed to do this!",
                ephemeral: true
            })
        }
        switch (fixId(interaction.customId)) {
            case 'ms-start': {
                const row = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                            .setCustomId('ms-flag-' + interaction.user.id)
                            .setLabel('Flag')
                            .setStyle("SUCCESS"),
                        new Discord.MessageButton()
                            .setCustomId('ms-reveal-' + interaction.user.id)
                            .setLabel('Reveal')
                            .setStyle("SUCCESS"),
                        new Discord.MessageButton()
                            .setCustomId('ms-stop-game-' + interaction.user.id)
                            .setLabel('End the game')
                            .setStyle("DANGER")
                    ]);
                interaction.update({
                    content: renderGrid(minesweeperGames.get(interaction.user.id),false),
                    components: [row]
                })
                break;
            }
            case 'ms-cancel': {
                interaction.update({ content: "Ok...", components: [] })
                minesweeperGames.delete(interaction.user.id)
                break;
            }
            case 'ms-flag': {
                const flagModal = new discordModals.Modal() // We create a Modal
                    .setCustomId('ms-flag')
                    .setTitle('Interact with the grid')
                flagModal.components = [
                    new discordModals.TextInputComponent()
                        .setCustomId('ms-box')
                        .setLabel('Which tile do you want to reveal?')
                        .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                        .setMinLength(2)
                        .setMaxLength(2)
                        .setPlaceholder('a1')
                        .setRequired(true) // If it's required or not
                ]
                discordModals.showModal(flagModal, {
                    client: client,
                    interaction: interaction
                })
                break;
            }
            case 'ms-reveal': {
                const revealModal = new discordModals.Modal() // We create a Modal
                    .setCustomId('ms-reveal')
                    .setTitle('Interact with the grid')
                revealModal.components = [new discordModals.TextInputComponent() // We create a Text Input Component
                    .setCustomId('ms-box')
                    .setLabel('What do you want to reveal?')
                    .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                    .setMinLength(2)
                    .setMaxLength(2)
                    .setPlaceholder('a1')
                    .setRequired(true) // If it's required or not
                ]
                discordModals.showModal(revealModal, {
                    client: client,
                    interaction: interaction
                })
                break;
            }
            case 'ms-stop-game': {
                interaction.update({
                    components: [], content: renderGrid(minesweeperGames.get(interaction.user.id), true)
                }).then(() => minesweeperGames.delete(interaction.user.id))
                break;
            }
            default: {
                break;
            }
        }
    }
});

client.on('modalSubmit', async (modal) => {
    let box = modal.getTextInputValue('ms-box'), tile_str = "", tile: number[] = [];
    const game = minesweeperGames.get(modal.member.id);
    try {
        tile = [parseInt(box[1]) - 1, letterToNum(box[0])]
        tile_str = `${tile[0]} ${tile[1]}`
        if (!game.matrix[tile[0]] || !game.matrix[0][tile[1]] || tile[0] < -1 || tile[0] > 6 || tile[1] < -1 || tile[1] > 8) {
            return modal.reply({
                content: "This does not seem to exist",
                ephemeral: true
            })
        }
    } catch (e) {
        console.log(e)
        return modal.reply({
            content: "Something wrong happened when trying to see which case you've selected, please try again",
            ephemeral: true
        })
    }
    if (modal.customId === 'ms-reveal') {
        if (game.flagged.includes("" + tile_str)) {
            game.flagged = game.flagged.filter(i => i != "" + tile_str)
        }
        if (game.revealed.includes("" + tile_str)) {
            modal.reply({
                content: "This case has already been revealed!",
                ephemeral: true
            })
            modal.fetchReply().then(msg => {
                setTimeout(msg.delete, 5000)
            })
            return;
        }
        const box_content = game.matrix[tile[0]][tile[1]]
        if (box_content == "boom") {
            game.bombsHitRemaining -= 1
            if (game.bombsHitRemaining == 0) {
                modal.update({ components: [], content: renderGrid(minesweeperGames.get(modal.member.id), true) }).then(() => minesweeperGames.delete(modal.member.id))
                return;
            }
            game.revealed.push("" + tile_str)
        } else (
            game.revealed.push("" + tile_str)
        )
    } else if (modal.customId === 'ms-flag') {
        if (game.revealed.includes("" + tile_str)) {
            modal.reply({
                content: "You can not flag a revealed case!",
                ephemeral: true
            })
            modal.fetchReply().then(msg => {
                setTimeout(msg.delete,5000)
            })
            return;
        }
        game.flagged.push("" + tile_str)
    }
    game.turn += 1;
    minesweeperGames.set(modal.member.id, game)
    const row = new Discord.MessageActionRow()
        .addComponents([
            new Discord.MessageButton()
                .setCustomId('ms-flag-' + modal.member.id)
                .setLabel('Flag')
                .setStyle("SUCCESS"),
            new Discord.MessageButton()
                .setCustomId('ms-reveal-' + modal.member.id)
                .setLabel('Reveal')
                .setStyle("SUCCESS"),
            new Discord.MessageButton()
                .setCustomId('ms-stop-game-' + modal.member.id)
                .setLabel('End the game')
                .setStyle("DANGER")
        ]);
    modal.update({
        content: renderGrid(minesweeperGames.get(modal.member.id),false),
        components: [row]
    })
});

function checkMember(s, id) {
    return s.split("-")[s.split("-").length - 1] == id
}

function fixId(s) {
    let t = s.split("-"), out = "";
    for (let i = 0; i < t.length - 1; i++) {
        out += t[i] + "-"
    }
    out = out.slice(0, -1)
    return out
}

function letterToNum(s) {
    return s.charCodeAt(0) - 97
}

async function addCoin(id, amount) {
    const coins = db.get("coins." + id)
    if (!coins) {
        db.set("coins." + id, Math.floor(amount))
    }
    if (Math.floor(coins / 100) < Math.floor(coins / 100 + amount / 100)) {
        const channel = await client.channels.fetch("940170551824117801");
        if (!channel || !channel.isText()) return;
        channel.send({
            content: `<@${id}> just got **1** more DECoin! Their total coin count now is **${Math.floor(coins / 100 + amount / 100)}**!`,
            allowedMentions: { parse: [] }
        })
    }
    db.add("coins." + id, amount)
}

function renderGrid(game, ended) {
    let str = `<@${game.memberId}>\n            :regional_indicator_a::regional_indicator_b::regional_indicator_c::regional_indicator_d::regional_indicator_e::regional_indicator_f::regional_indicator_g::regional_indicator_h:\n\n`;
    if (!ended) ended = false
    for (let i = 0; i < game.matrix.length; i++) {
        str += `${numToEmojis(i + 1)}      `;
        for (let j = 0; j < game.matrix[0].length; j++) {
            if (game.revealed.includes(`${i} ${j}`) || ended == true) {
                str += emojis[game.matrix[i][j]]
            } else if (game.flagged.includes(`${i} ${j}`)) {
                str += emojis["flagged"]
            } else {
                str += emojis['notRevealed']
            }
        }
        str += "\n"
    }
    str += `\n\n:clock2:${numToEmojis(game.turn)}\n                        ${emojis['flagged']}${numToEmojis(game.flagLimit - game.flagged.length)}\n${emojis['boom']}${numToEmojis(game.bombsHitRemaining)}`
    return str
}

function numToEmojis(n) {
    let numbers = "" + n, out = "";
    for (let i = 0; i < numbers.length; i++) {
        switch (numbers.charAt(i)) {
            case '0': {
                out += ":zero:"
                break;
            }
            case '1': {
                out += ":one:"
                break;
            }
            case '2': {
                out += ":two:"
                break;
            }
            case '3': {
                out += ":three:"
                break;
            }
            case '4': {
                out += ":four:"
                break;
            }
            case '5': {
                out += ":five:"
                break;
            }
            case '6': {
                out += ":six:"
                break;
            }
            case '7': {
                out += ":seven:"
                break;
            }
            case '8': {
                out += ":eight:"
                break;
            }
            case '9': {
                out += ":nine:"
                break;
            }
            default: {
                break;
            }
        }
    }
    return out;

}

client.login(token);