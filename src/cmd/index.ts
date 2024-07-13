import { Command } from "@utils/types.js";

import help from "./help.js";
import { pause, resume } from "./pause.js";
import reloadConfig from "./reloadConfig.js";
import user from "./user.js";

export const cmds: Command[] = [help, pause, resume, user, reloadConfig];

export default function loadCommands(): { [key: string]: Command } {
    const commands: { [key: string]: Command } = {};

    cmds.forEach((command) => {
        commands[command.name] = command;

        if (command.aliases) {
            command.aliases.forEach((alias) => {
                commands[alias] = command;
            });
        }
    });

    return commands;
}
