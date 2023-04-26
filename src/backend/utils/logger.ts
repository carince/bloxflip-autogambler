import chalk from "chalk";
import { config } from "@utils/config.js";
import { LoggerOptions } from "@types";

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

        let labelStyle = chalk.bold.bgRedBright.ansi(30);
        let infoStyle = chalk.redBright;

        if (customColor) {
            labelStyle = chalk.bold.bgAnsi(customColor).ansi(30);
            infoStyle = chalk.bold.ansi(customColor);
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
