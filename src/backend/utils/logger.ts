import chalk from "chalk";
import { config } from "@utils/config.js";

interface loggerOptions {
    customColor?: number;
    seperator?: boolean;
}

export class Logger {
    public static log(label: string, message: string, options?: loggerOptions): void {
        const customColor = options?.customColor;
        const seperator = options?.seperator;
        const seperatorText = "──────────────────────────────────\n";

        let labelStyle = chalk.bold.bgGreenBright.ansi(30);
        let infoStyle = chalk.greenBright;

        if (customColor) {
            labelStyle = chalk.bold.bgAnsi(customColor).ansi(30);
            infoStyle = chalk.bold.ansi(customColor);
        }

        console.log((`${labelStyle(` ${label} `)} ${infoStyle(`${seperator ? `${seperatorText}` : ""}${message}`)}`));
    }

    public static info(label: string, message: string): void {
        if (config.debugging.verbose) {
            console.log(`${chalk.bold.bgBlueBright.ansi(30)(` ${label} `)} ${chalk.blueBright(message)}`);
        }
    }

    public static error(label: string, message: string, forceClose?: boolean): void {
        console.log(`${chalk.bold.bgRedBright.ansi(30)(` ${label} `)} ${chalk.redBright(message)}`);
        if (forceClose) process.exit();
    }

    public static warn(label: string, message: string): void {
        console.log(`${chalk.bold.bgYellowBright.ansi(30)(` ${label} `)} ${chalk.yellowBright(message)}`);
    }
}
