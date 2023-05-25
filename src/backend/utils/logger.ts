import chalk from "chalk";
import { createWriteStream, WriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "@utils/config.js";
import { LoggerOptions } from "@types";
import { sleep } from "@utils/sleep.js";
import { __dirname } from "@utils/constants.js";

const seperatorChar = "─";
let logFile: string;
let logStream: WriteStream;

export default class Logger {
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

    public static async error(label: string, message: string, options?: LoggerOptions & { forceClose: boolean }): Promise<void> {
        const customColor = options?.customColor;
        const seperator = options?.seperator;
        const seperatorString = seperatorChar.repeat(Logger.getLongestLine(message));

        let labelStyle = chalk.bold.bgRedBright.ansi(30);
        let infoStyle = chalk.redBright;

        if (customColor) {
            labelStyle = chalk.bold.bgAnsi(customColor).ansi(30);
            infoStyle = chalk.bold.ansi(customColor);
        }

        console.log(`${labelStyle(` ${label} `)} ${infoStyle(`${seperator ? `${seperatorString}\n` : ""}${message}`)}`);
        await sleep(60000);
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

    public static async logToLogs(log: string): Promise<void> {
        logStream.write(`${log}\n`);
    }

    private static getLongestLine(string: string): number {
        const lines = string.split(/\r?\n/);
        return Math.max(...(lines.map(line => line.length)));
    }
}

async function createLog() {
    const date = new Date;
    logFile = join(__dirname, "..", "logs", `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getSeconds()}.txt`);

    if (!existsSync(join(__dirname, "..", "logs"))){
        mkdirSync(join(__dirname, "..", "logs"));
    }

    Logger.info("LOGS", `Creating log file: "${logFile}"`);
    logStream = createWriteStream(logFile);
}

export { Logger, createLog, logFile };
