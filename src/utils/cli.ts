/* eslint-disable no-console */
import chalk from "chalk";
import { createInterface, Interface } from "readline/promises";

import loadCmds from "../cmd/index.js";

let rl: Interface;

async function handleInput(input: string) {
    const commands = await loadCmds();
    const [cmd, ...args] = input.trim().split(" ");
    if (commands[cmd]) {
        commands[cmd].execute(args);
    } else {
        console.log(chalk.redBright(`Command '${cmd}' not recognized. Type 'help' for assistance.`));
    }
    rl.prompt(true);
}

async function startCli() {
    rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.greenBright("> "),
        terminal: true,
    });

    rl.on("line", (input) => {
        handleInput(input);
    });

    rl.on("close", () => {
        console.log(chalk.redBright("Detected ^C, exiting bloxflip-autogambler."));
        process.exit(0);
    });

    rl.prompt();
}

export { rl, startCli };
