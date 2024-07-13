/* eslint-disable no-console */
import { Command } from "@utils/types.js";
import chalk from "chalk";

import { cmds } from "./index.js";

const help: Command = {
    name: "help",
    description: "Show this help message",
    execute: async () => {
        console.log(chalk.blueBright("List of available commands:"));
        cmds.forEach((command) => {
            console.log(`    ${chalk.yellow(command.name)}${command.aliases ? `/${command.aliases.join("/")}` : ""} - ${command.description}`);
        });
    },
};

export default help;
