import chalk from "chalk";
import { createWriteStream, WriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "@utils/config.js";
import { __dirname } from "@utils/constants.js";
import { Game } from "@types";
import { sleep } from "./sleep.js";

let logFile: string;
let logStream: WriteStream;

class Logger {
    public static async log(label: string, message: string): Promise<void> {
        console.log((`${chalk.bgGreenBright.black(` ${label} `)} ${chalk.greenBright(message)}`));
    }

    public static info(label: string, message: string): void {
        if (config.debugging.verbose) {
            console.log(`${chalk.bgBlueBright(` ${label} `)} ${chalk.blueBright(message)}`);
        }
    }

    public static warn(label: string, message: string): void {
        console.log(`${chalk.bgYellowBright.black(` ▲ ${label} `)} ${chalk.yellowBright(message)}`);
    }

    public static async error(label: string, message: string, options?: { forceClose?: boolean }): Promise<void> {
        console.log(`${chalk.bgRedBright(` ⬣ ${label} `)} ${chalk.redBright(message)}`);
        await sleep(15000)
        if (options?.forceClose) process.exit(1);
    }

    public static async logGame(game: Game & { lossStreak: number }) {
        if (game.crash >= config.bet.auto_cashout) {
            const message = `Status: Won \nCrash Point: ${game.crash}x \nBet: ${game.bet} R$, Balance: ${game.balance} R$`;
            const seperator = "-".repeat(Logger.getLongestLine(message) - 6);

            console.log(`${chalk.bgGreenBright(" GAME ")} ${chalk.greenBright(`${seperator}\n${message}`)}`);
        } else {
            const message = `Status: Loss - #${game.lossStreak} \nCrash Point: ${game.crash}x \nBet: ${game.bet} R$, Balance: ${game.balance} R$`;
            const seperator = "-".repeat(Logger.getLongestLine(message) - 7);

            console.log(`${chalk.bgRedBright(" GAME ")} ${chalk.redBright(`${seperator}\n${message}`)}`);
        }
    }

    public static async logToLogs(log: string): Promise<void> {
        logStream.write(`${log}\n`);
    }

    public static async createLog() {
        const date = new Date;
        logFile = join(__dirname, "..", "logs", `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`);

        if (!existsSync(join(__dirname, "..", "logs"))) {
            mkdirSync(join(__dirname, "..", "logs"));
        }

        Logger.info("LOGS", `Successfully created log file: "${logFile}"`);
        logStream = createWriteStream(logFile);
    }

    private static getLongestLine(string: string): number {
        const lines = string.split(/\r?\n/);
        return Math.max(...(lines.map(line => line.length)));
    }
}

export { Logger, logFile };
