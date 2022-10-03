import chalk from "chalk";
import { config } from "./config";
import { page } from "../index";

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
        if (config.debugging.ssOnError) page.screenshot({ path: "error.png" });
        if (forceClose || config.debugging.exitOnError) process.exit();
    }

    public static warn(type: string, info: string): void {
        type.toUpperCase();
        console.log(chalk.yellowBright(`${chalk.bold(`[${type}]`)} \t${info}`));
    }
}
