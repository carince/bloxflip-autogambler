import chalk from "chalk";
import { config } from "@utils/config.js";
import { __dirname } from "@utils/constants.js";
import { Game } from "@types";
import { sleep } from "./sleep.js";

const seperatorChar = "─";

export class Logger {
    public static async log(label: string, message: string, options?: LoggerOptions): Promise<void> {
        const customColor = options?.customColor;
        const seperator = options?.seperator;
        const seperatorString = seperatorChar.repeat(Logger.getLongestLine(message));

        let labelStyle = chalk.bold.bgGreenBright.ansi(30);
        let infoStyle = chalk.greenBright;

        if (customColor) {
            labelStyle = chalk.bold.bgAnsi(customColor).ansi(30);
            infoStyle = chalk.bold.ansi(customColor);
        }

        console.log((`${labelStyle(` ${label} `)} ${infoStyle(`${seperator ? `${seperatorString}\n` : ""}${message}`)}`));
    }

    public static info(label: string, message: string, options?: LoggerOptions): void {
        if (config.debugging.verbose) {
            const customColor = options?.customColor;
            const seperator = options?.seperator;
            const seperatorString = seperatorChar.repeat(Logger.getLongestLine(message));

            let labelStyle = chalk.bold.bgBlueBright.ansi(30);
            let infoStyle = chalk.blueBright;

            if (customColor) {
                labelStyle = chalk.bold.bgAnsi(customColor).ansi(30);
                infoStyle = chalk.bold.ansi(customColor);
            }

            console.log(`${labelStyle(` ${label} `)} ${infoStyle(`${seperator ? `${seperatorString}\n` : ""}${message}`)}`);
        }
    }

    public static error(label: string, message: string, options?: LoggerOptions & { forceClose: boolean }): void {
        const customColor = options?.customColor;
        const seperator = options?.seperator;
        const seperatorString = seperatorChar.repeat(Logger.getLongestLine(message));

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

        console.log(`${labelStyle(` ${label} `)} ${infoStyle(`${seperator ? `${seperatorString}\n` : ""}${message}`)}`);
        if (options) process.exit();
    }

    public static warn(label: string, message: string, options?: LoggerOptions): void {
        const customColor = options?.customColor;
        const seperator = options?.seperator;
        const seperatorString = seperatorChar.repeat(Logger.getLongestLine(message));

        let labelStyle = chalk.bold.bgYellowBright.ansi(30);
        let infoStyle = chalk.yellowBright;

        if (customColor) {
            labelStyle = chalk.bold.bgAnsi(customColor).ansi(30);
            infoStyle = chalk.bold.ansi(customColor);
        }

        console.log(`${labelStyle(` ${label} `)} ${infoStyle(`${seperator ? `${seperatorString}\n` : ""}${message}`)}`);
    }

    private static getLongestLine(string: string): number {
        const lines = string.split(/\r?\n/);
        return Math.max(...(lines.map(line => line.length)));
    }
}
