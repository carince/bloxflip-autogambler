import connectChat from "@bf/chat.js";
import connectCrash from "@bf/crash.js";
import connectWallet from "@bf/wallet.js";
import { config } from "@utils/config.js";
import { USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import { Manager } from "socket.io-client";

let manager: Manager;

export default async function startWebsocket() {
    try {
        manager = new Manager("wss://ws.bloxflip.com", {
            autoConnect: false,
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            extraHeaders: {
                "User-Agent": USER_AGENT,
            },
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

export { manager };
