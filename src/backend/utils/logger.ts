import chalk from "chalk";
import { config } from "@utils/config.js";
import { sleep } from "./sleep.js";

class Logger {
    public static async log(label: string, message: string): Promise<void> {
        console.log((`${chalk.bgGreenBright.black(` ${label} `)} ${chalk.greenBright(message)}`));
    }

    public static info(label: string, message: string): void {
        if (config.debugging.verbose) {
            console.log(`${chalk.bgBlueBright(` ${label} `)} ${chalk.blueBright(message)}`);
        }
    }

    public static warn(label: string, message: string): void {
        console.log(`${chalk.bgYellowBright.black(` ▲ ${label} `)} ${chalk.yellowBright(message)}`);
    }

    public static async error(label: string, message: string, options?: { forceClose?: boolean }): Promise<void> {
        console.log(`${chalk.bgRedBright(` ⬣ ${label} `)} ${chalk.redBright(message)}`);
        await sleep(15000);
        if (options?.forceClose) process.exit(1);
    }
}

export { Logger };
