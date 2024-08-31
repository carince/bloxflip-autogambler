// eslint-disable-next-line
import { Manager } from "socket.io-client/dist/socket.io.js";

import { config } from "../utils/config.js";
import Logger from "../utils/logger.js";
import connectChat from "./chat.js";
import connectCrash from "./crash.js";
import connectWallet from "./wallet.js";

export let manager: Manager;

export default async function connectBloxflip() {
    try {
        manager = new Manager("wss://ws.bloxflip.com/", {
            autoConnect: false,
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        manager.open(async (err: unknown) => {
            if (err) throw new Error(`Error connecting to WebSocket: \n${err}`);

            Logger.info("SOCKET", "Connected to Bloxflip.");
            if (config.rain.enabled) { await connectChat(manager); }

            await connectWallet(manager);

            if (config.debugging.rain_only) {
                Logger.warn("SOCKET", "Rain only is enabled, won't connect to crash and wallet namespace.");
                return;
            }

            await connectCrash(manager);
        });
    } catch (e) {
        Logger.error("WS", e instanceof Error ? e.message : `Unknown Error.\n${e}`);
    }
}
