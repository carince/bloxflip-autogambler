/* eslint-disable no-console */
import chalk from "chalk";
import readline from "readline";

import { rl } from "./cli.js";

export default class Logger {
    static async log(label: string, message: string): Promise<void> {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log(chalk.greenBright(`${chalk.bold(`[ ${label} ]`)} ${message}`));
        if (rl) rl.prompt(true);
    }

    static async info(label: string, message: string): Promise<void> {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log(chalk.blueBright(`${chalk.bold(`[ ${label} ]`)} ${message}`));
        if (rl) rl.prompt(true);
    }

    static async warn(label: string, message: string): Promise<void> {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log(chalk.yellowBright(`${chalk.bold(`[ ▲ ${label} ]`)} ${message}`));
        if (rl) rl.prompt(true);
    }

    static async error(
        label: string,
        message: string,
        options?: { forceClose?: boolean },
    ): Promise<void> {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log(chalk.redBright(`${chalk.bold(`[ ⬣ ${label} ]`)} ${message}`));
        if (options?.forceClose) process.exit(1);
        if (rl) rl.prompt(true);
    }

    static async debug(data: any): Promise<void> {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log(chalk.magentaBright(`${chalk.bold("[ DEBUG ]")} ${data}`));
        if (rl) rl.prompt(true);
    }
}
