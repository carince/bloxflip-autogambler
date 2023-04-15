import chalk from "chalk";
import { config } from "@utils/config.js";

interface loggerOptions {
    customColor?: number;
    seperator?: boolean;
}

export class Logger {
    public static log(type: string, info: string, options?: loggerOptions): void {
        type.toUpperCase();

        const customColor = options?.customColor;
        const seperator = options?.seperator;
        const seperatorText = "──────────────────────────────────\n";

        let labelStyle = chalk.bold.bgGreenBright.ansi(30);
        let infoStyle = chalk.greenBright;

        if (customColor) {
            labelStyle = chalk.bold.bgAnsi(customColor).ansi(30);
            infoStyle = chalk.bold.ansi(customColor);
        }

        console.log((`${labelStyle(` ${type} `)} ${infoStyle(`${seperator ? `${seperatorText}` : ""}${info}`)}`));
    }

    public static info(type: string, info: string): void {
        if (config.debugging.verbose) {
            type.toUpperCase();
            console.log(`${chalk.bold.bgBlueBright.ansi(30)(` ${type} `)} ${chalk.blueBright(info)}`);
        }
    }

    public static error(type: string, info: string, forceClose?: boolean): void {
        type.toUpperCase();
        console.log(`${chalk.bold.bgRedBright.ansi(30)(` ${type} `)} ${chalk.redBright(info)}`);
        if (forceClose) process.exit();
    }

    public static warn(type: string, info: string): void {
        type.toUpperCase();
        console.log(`${chalk.bold.bgYellowBright.ansi(30)(` ${type} `)} ${chalk.yellowBright(info)}`);
    }
}
