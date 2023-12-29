import { USER_AGENT } from "@utils/constants.js";
// @ts-ignore
import { Manager } from "socket.io-client";
import { Logger } from "@utils/logger.js";
import { connectChatSocket } from "@bf/chat.js";
import { connectWalletSocket } from "./wallet.js";
import { connectCrashSocket } from "./crash/index.js";
import { analytics } from "@utils/analytics.js";

async function startManager() {
    const manager = new Manager("https://ws.bloxflip.com", {
        autoConnect: false,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        extraHeaders: {
            "Host": "ws.bloxflip.com",
            "Connection": "Upgrade",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "User-Agent": USER_AGENT,
            "Upgrade": "websocket",
            "Origin": "https://bloxflip.com",
            "Sec-WebSocket-Version": "13",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
        }
    });

    manager.open(async (err: any) => {
        if (err) {
            Logger.error("BF/MANAGER", `Error connecting to WebSocket: \n${err}`);
        } else {
            Logger.info("BF/MANAGER", "Connected to Bloxflip WebSocket.");
            await connectChatSocket(manager);
            await connectWalletSocket(manager);
            await connectCrashSocket(manager);
        }
    });

    manager.on("pong", (ms: number) => {
        analytics.appendLatency(ms);
    });
}

export { startManager };
