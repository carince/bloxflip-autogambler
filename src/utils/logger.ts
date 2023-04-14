import chalk from "chalk";
import { config } from "@utils/config.js";

export class Logger {
    public static log(type: string, info: string): void {
        type.toUpperCase();
        console.log(chalk.greenBright(`${chalk.bold.bgGreenBright(` ${type} `)} ${info}`));
    }

    public static info(type: string, info: string): void {
        if (config.debugging.verbose) {
            type.toUpperCase();
            console.log(chalk.blueBright(`${chalk.bold.bgBlueBright(` ${type} `)} ${info}`));
        }
    }

    public static error(type: string, info: string, forceClose?: boolean): void {
        type.toUpperCase();
        console.log(chalk.redBright(`${chalk.bold.bgRedBright(` ${type} `)} ${info}`));
        if (forceClose || config.debugging.exitOnError) process.exit();
    }

    public static warn(type: string, info: string): void {
        type.toUpperCase();
        console.log(chalk.yellowBright(`${chalk.bold.yellowBright(` ${type} `)} ${info}`));
    }
}
