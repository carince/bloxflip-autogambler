import { USER_AGENT } from "@utils/constants.js";
// @ts-ignore
import { Manager } from "socket.io-client";
import { Logger } from "@utils/logger.js";
import { connectChatSocket } from "@bf/chat.js";
import { connectWalletSocket } from "@bf/wallet.js";
import { connectCrashSocket } from "@bf/crash/index.js";
import { connectRouletteSocket } from "@bf/roulette/index.js";
import { config } from "@utils/config.js";
import { startBrowser } from "@utils/browser.js";

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
            if (config.rain.enabled) {
                await startBrowser()
                await connectChatSocket(manager);
            }
            await connectWalletSocket(manager);
            
            if (config.debugging.rain_only) return;

            if (config.bet.game === "crash") {
                await connectCrashSocket(manager);
            } else {
                await connectRouletteSocket(manager);
            }
        }
    });
}

export { startManager };
