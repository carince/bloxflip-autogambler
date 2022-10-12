import chalk from "chalk";
import { config } from "./config.js";
import { page } from "../index.js";

export class Logger {
    public static log(type: string, info: string): void {
        type.toUpperCase();
        console.log(chalk.greenBright(`${chalk.bold(`[${type}]`)} \t${info}`));
    }

    public static info(type: string, info: string): void {
        if (config.debugging.verbose) {
            type.toUpperCase();
            console.log(chalk.blueBright(`${chalk.bold(`[${type}]`)} \t${info}`));
        }
    }

    public static error(type: string, info: string, forceClose?: boolean): void {
        type.toUpperCase();
        console.log(chalk.redBright(`${chalk.bold(`[${type}]`)} \t${info}`));
        if (config.debugging.ssOnError) {
            if (page) {
                page.screenshot({ path: "error.png" })
            } else {
                Logger.info("LOGGER", "Chrome is not yet launched, ignoring page ss.")
            }
        };
        if (forceClose || config.debugging.exitOnError) process.exit();
    }

    public static warn(type: string, info: string): void {
        type.toUpperCase();
        console.log(chalk.yellowBright(`${chalk.bold(`[${type}]`)} \t${info}`));
    }
}
