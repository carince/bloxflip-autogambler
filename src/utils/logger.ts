/* eslint-disable no-console */
import chalk from "chalk";

export default class Logger {
    static async log(label: string, message: string): Promise<void> {
        console.log(chalk.greenBright(`${chalk.bold(`[ ${label} ]`)} ${message}`));
    }

    static info(label: string, message: string): void {
        console.log(chalk.blueBright(`${chalk.bold(`[ ${label} ]`)} ${message}`));
    }

    static warn(label: string, message: string): void {
        console.log(chalk.yellowBright(`${chalk.bold(`[ ▲ ${label} ]`)} ${message}`));
    }

    static async error(
        label: string,
        message: string,
        options?: { forceClose?: boolean },
    ): Promise<void> {
        console.log(chalk.redBright(`${chalk.bold(`[ ⬣ ${label} ]`)} ${message}`));
        if (options?.forceClose) process.exit(1);
    }

    static debug(data: any): void {
        console.log(chalk.magentaBright(`${chalk.bold("[ DEBUG ]")} ${data}`));
    }
}
