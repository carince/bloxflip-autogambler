import connectChat, { socket as chat } from "@bf/chat.js";
import connectCrash, { socket as crash } from "@bf/crash.js";
import { manager } from "@bf/index.js";
import { browser, startBrowser } from "@utils/browser.js";
import { config, fetchConfig } from "@utils/config.js";
import Logger from "@utils/logger.js";
import { Command } from "@utils/types.js";
import { Browser } from "puppeteer";
import { Socket } from "socket.io-client";

const reloadConfig: Command = {
    name: "reloadcfg",
    aliases: ["rcfg"],
    description: "Reloads the config",
    execute: async () => {
        Logger.log("RCFG", "Command is a WIP and unstable");

        await fetchConfig();
        if (config.rain.autojoin.enabled) {
            if (!(browser instanceof Browser)) {
                await startBrowser();
            }
        }

        if (config.rain.enabled) {
            if (chat instanceof Socket) {
                chat.open();
            } else {
                await connectChat(manager);
            }
        } else if (chat instanceof Socket) {
            chat.close();
        }

        if (config.debugging.rain_only) {
            if (crash instanceof Socket) {
                if (crash.connected) {
                    crash.close();
                }
            }
        } else if (crash instanceof Socket) {
            if (crash.disconnected) {
                crash.open();
            }
        } else {
            await connectCrash(manager);
        }

        Logger.log("CONFIG", "Config successfully reloaded!");
    },
};

export default reloadConfig;
