import { ModalSubmitInteraction } from "discord-modals";
import BotClient from "../classes/Client";
import { renderGrid } from "../functions/renderGrid";
import { msButtons } from "../constants/msButtons";
import { fixId } from "../functions/fixId";
import { emojis } from "../constants/emojis";
import { setCharAt } from "../functions/setCharAt";
import { Interaction, MessageActionRow, MessageButton } from "discord.js";
import { possibleWordleGuess, possibleWordleSolutions } from "../constants/wordle";

export async function event(modal: ModalSubmitInteraction, client: BotClient) {
    if (modal.customId.startsWith("ms")) {
        let box = modal.getTextInputValue("ms-box"), tile_str = "", tile: number[] = [];
        const gameId = modal.customId.split("-")[modal.customId.split("-").length - 1]
        const game = client.minesweeperGames.get(gameId)!
        if (!game) {
            await modal.deferReply({ ephemeral: true })
            return modal.followUp({
                content: "oopsie happened, or the bot restarted, sorry",
                ephemeral: true
            })
        }
        try {
            tile = [parseInt(box[2]) - 1, parseInt(box[0]) - 1]
            tile_str = `${tile[0]} ${tile[1]}`
            if (box[1] !== "," || !game.matrix[tile[0]] || !game.matrix[0][tile[1]] || tile[0] < -1 || tile[0] > 6 || tile[1] < -1 || tile[1] > 8) {
                await modal.deferReply({ ephemeral: true })
                return modal.followUp({
                    content: "This tile does not seem to exist, or it was not inputed correctly",
                })
            }
        } catch (e) {
            console.log(e)
            await modal.deferReply({ ephemeral: true })
            return modal.followUp({
                content: "Something wrong happened when trying to see which tile you've selected, please try again",
            })
        }
        switch (fixId(modal.customId)) {
            case "ms-reveal": {
                if (game.flagged.includes("" + tile_str)) {
                    game.flagged = game.flagged.filter(i => i != "" + tile_str)
                }
                if (game.revealed.includes("" + tile_str)) {
                    await modal.deferReply({ ephemeral: true })
                    modal.followUp({
                        content: "This tile has already been revealed!",
                    })
                    return;
                }
                const tile_content = game.matrix[tile[0]][tile[1]]
                if (tile_content == "boom") {
                    game.remainingHP -= 1
                    if (game.remainingHP == 0) {
                        modal.update({ components: [], content: renderGrid(game, true) }).then(() => client.minesweeperGames.delete(game.id))
                        return;
                    }
                } else {
                    function reveal(arr: number[]) {
                        game.revealed.push(`${arr[0]} ${arr[1]}`)
                        if (game.matrix[arr[0]][arr[1]] == 'zero') {
                            for (let i = -1; i < 2; i++) {
                                for (let j = -1; j < 2; j++) {
                                    if (i === 0 && j === 0) {
                                        continue
                                    }
                                    if (!game.matrix[i + arr[0]] || !game.matrix[i + arr[0]][j + arr[1]]) {
                                        continue;
                                    }
                                    if (game.revealed.includes(`${i + arr[0]} ${j + arr[1]}`)) {
                                        continue
                                    }
                                    let cell = game.matrix[i + arr[0]][j + arr[1]]
                                    if (cell === "boom") {
                                        continue;
                                    } else if (cell === "zero") {
                                        reveal([i + arr[0], j + arr[1]])
                                    } else {
                                        game.revealed.push(`${i + arr[0]} ${j + arr[1]}`)
                                    }
                                }
                            }
                        }
                    }
                    reveal(tile)
                }
                break;
            }
            case "ms-flag": {
                if (game.revealed.includes("" + tile_str)) {
                    await modal.deferReply({ ephemeral: true })
                    modal.followUp({
                        content: "You can not flag a revealed tile!",
                    })
                    return;
                }
                game.flagged.push("" + tile_str)
                break;
            }
            case "ms-unflag": {
                if (!game.flagged.includes("" + tile_str)) {
                    await modal.deferReply({ ephemeral: true })
                    modal.reply({
                        content: "You can't unflag a non flagged tile!"
                    })
                }
                game.flagged = game.flagged.filter(i => i != "" + tile_str)
                break;
            }
            default: {
                console.log("how");
                break;
            }
        }
        game.turn += 1;
        client.minesweeperGames.set(game.id, game)
        msButtons.components[0].setCustomId("ms-flag-" + game.id)
        msButtons.components[1].setCustomId("ms-unflag-" + game.id)
        msButtons.components[2].setCustomId("ms-reveal-" + game.id)
        msButtons.components[3].setCustomId("ms-stop-game-" + game.id)
        modal.update({
            content: renderGrid(client.minesweeperGames.get(game.id), false),
            components: [msButtons]
        })
    } else if (modal.customId.startsWith("wordle")) {
        let guess = modal.getTextInputValue("wordle-guess").toLowerCase(),
            type = modal.customId.split("-")[1],
            solution = modal.customId.split("-")[2].toLowerCase(),
            guessCount = modal.message.content[6],
            str = modal.message.editedAt ? setCharAt(modal.message.content, 6, String(parseInt(guessCount) + 1)) + "\n" : "Guess 1/6\n\n";
        if (!possibleWordleGuess.includes(guess) && !possibleWordleSolutions.includes(guess)) {
            await modal.deferReply({ ephemeral: true })
            modal.followUp({
                content: "This guess is not in our list...",
                ephemeral: true
            })
            return;
        }
        let row = [new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId(modal.customId)
                    .setLabel("Guess a word")
                    .setStyle("SUCCESS"),
            ])]
        if (guess == solution) {
            row = []
            for (let i = 0; i < 5; i++) {
                str += emojis["g"]
            }
            str += ` - ||${solution.toUpperCase()}||`
            if (type == "daily") {
                let arr = client.db.get("wordleGuessedIds");
                arr.push(modal.user.id);
                client.db.set("wordleGuessedIds", arr);
                client.db.add(`coins.${modal.user.id}`, 200)
                str += "\n\nCongrats, you found today's word! Two coins have been added to your balance."
            } else {
                client.db.add(`coins.${modal.user.id}`, 75)
                str += "\n\nCongrats, you found the word! 0.75 coins have been added to your balance."
            }
            return modal.update({
                content: str,
                components: row
            })
        } else {
            const result = new Array(solution.length).fill({});

            const userWord = guess.toLowerCase().split('');


            // Set correctly guessed letters to green
            userWord.forEach((letter, index) => {
                if (letter === solution[index]) {
                    result[index] = {
                        ...result[index],
                        letter,
                        color: 'g',
                    };
                }
            });

            // Set wrongly placed letters to yellow
            userWord.forEach((letter, index) => {
                if (!result[index].color && solution.includes(letter)) {
                    const matchingResultLetters = result.filter((item) => item.letter === letter);
                    const matchingWordOfTheDayLetters = solution.split("").filter((item) => item === letter);

                    if (matchingResultLetters.length < matchingWordOfTheDayLetters.length) {
                        result[index] = {
                            ...result[index],
                            letter,
                            color: 'y',
                        };
                    }
                }
            });

            // Set all other letters to none
            userWord.forEach((letter, index) => {
                if (!result[index].color) {
                    result[index] = {
                        ...result[index],
                        letter,
                        color: 'b',
                    };
                }
            });

            result.forEach(letter => {
                str += emojis[letter.color]
            })
            str += ` - ||${guess.toUpperCase()}||`
        }
        if (parseInt(guessCount) + 1 == 6) { //sixth try and they failed
            if (type == "daily") {
                let arr = client.db.get("wordleGuessedIds");
                arr.push(modal.user.id);
                client.db.set("wordleGuessedIds", arr);
            }
            str += `\n\nOh no, you didn't found the word! It was ||**${solution}**|| :(`;
            row = []
        }
        modal.update({
            content: str,
            components: row
        })
    }
}