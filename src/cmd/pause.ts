import { cliConfig } from "@utils/config.js";
import Logger from "@utils/logger.js";
import { Command } from "@utils/types.js";

const pause: Command = {
    name: "pause",
    aliases: ["p"],
    description: "Pauses the autogambler",
    execute: async (): Promise<void> => {
        cliConfig.paused = true;
        Logger.info("CRASH", "Paused ❚❚");
    },
};

const resume: Command = {
    name: "resume",
    aliases: ["r"],
    description: "Resumes the autogambler",
    execute: async (): Promise<void> => {
        cliConfig.paused = false;
        Logger.info("CRASH", "Resuming ▶");
    },
};

export { pause, resume };
