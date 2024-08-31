/* eslint-disable no-console */
import chalk from "chalk";

import { config } from "./config.js";
import { Game } from "./types.js";

export default class Logger {
    static async log(label: string, message: string): Promise<void> {
        console.log(chalk.greenBright(`${chalk.bold(`[ ${label} ]`)} ${message}`));
    }

    static async info(label: string, message: string): Promise<void> {
        console.log(chalk.blueBright(`${chalk.bold(`[ ${label} ]`)} ${message}`));
    }

    static async warn(label: string, message: string): Promise<void> {
        console.log(chalk.yellowBright(`${chalk.bold(`[ ▲ ${label} ]`)} ${message}`));
    }

    static async error(
        label: string,
        message: string,
        options?: { forceClose?: boolean },
    ): Promise<void> {
        console.log(chalk.redBright(`${chalk.bold(`[ ⬣ ${label} ]`)} ${message}`));
        if (options?.forceClose) process.exit(1);
    }

    static async debug(data: any): Promise<void> {
        console.log(chalk.magentaBright(`${chalk.bold("[ DEBUG ]")} ${data}`));
    }

    static async logGame(game: Game) {
        const win = game.crash >= config.autocashout;
        const message = `Game #${game.count}\nStatus: ${win ? "Won" : `Loss - #${game.lossStreak}`} \nCrash Point: ${game.crash}x \nBet: ${game.bet} R$, Balance: ${game.balance} R$`;
        const lines = message.split(/\r?\n/);
        const seperator = "—".repeat(Math.max(...(lines.map((line) => line.trim().length))));

        if (win) {
            console.log(chalk.greenBright(`${seperator}\n${message}`));
        } else {
            console.log(chalk.redBright(`${seperator}\n${message}`));
        }
    }
}
