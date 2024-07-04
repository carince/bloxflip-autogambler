import connectChat from "@bf/chat.js";
import connectCrash from "@bf/crash.js";
import connectWallet from "@bf/wallet.js";
import { config } from "@utils/config.js";
import { USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import { Manager } from "socket.io-client";

export default async function startWebsocket() {
    try {
        const manager = new Manager("https://ws.bloxflip.com", {
            autoConnect: false,
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            extraHeaders: {
                Host: "ws.bloxflip.com",
                Connection: "Upgrade",
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
                "User-Agent": USER_AGENT,
                Upgrade: "websocket",
                Origin: "https://bloxflip.com",
                "Sec-WebSocket-Version": "13",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        manager.open(async (err: unknown) => {
            if (err) throw new Error(`Error connecting to WebSocket: \n${err}`);

            Logger.info("WS", "Connected to Bloxflip WebSocket.");
            if (config.rain.enabled) { await connectChat(manager); }
            await connectWallet(manager);
            await connectCrash(manager);
        });
    } catch (e) {
        Logger.error("WS", e instanceof Error ? e.message : `Unknown Error.\n${e}`);
    }
}
