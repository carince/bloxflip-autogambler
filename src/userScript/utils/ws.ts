// @ts-ignore
import io from "../../../node_modules/socket.io/client-dist/socket.io.esm.min.js";
import { fetchConfig } from "./config.js";
import { Logger } from "./logger.js";
import { config } from "./config.js";
import { calculateBet } from "../bloxflip/bet.js";
import { startAutoCrash } from "../bloxflip/crash.js";

let serverWs: any;
let bfWs: WebSocket;

async function connectServerWs() {
    serverWs = await io("http://localhost:6580", {
        transports: ["websocket"]
    });

    serverWs.on("connect", async () => {
        Logger.info("SERVER", `Successfully connected to server with ID: ${serverWs.id}`);
        await fetchConfig();
        await startAutoCrash();
    });
}

async function connectBfWs() {
    if (bfWs?.OPEN) return Logger.warn("BF", "Already connected to Bloxflip WebSocket, returning...");

    bfWs = new WebSocket("wss://ws.bloxflip.com/socket.io/?EIO=3&transport=websocket");

    bfWs.addEventListener("message", async (event) => {
        if (event.data.charAt(0) == "0") {
            if (config.rain.enabled) bfWsSend("40/chat,");
            bfWsSend("40/crash,");
        }

        if (event.data == "40/crash") {
            bfWsSend(`42/crash,["auth","${config.auth}"]`);
            Logger.info("BF", "Successfully authorized account.");
            await calculateBet(true);
        }

        if (event.data.includes("new-chat-message")) return;
        if (event.data.includes("users-online")) return;
        // Sometimes bloxflip's websocket keeps on getting scammed with SCAM!!!!!! notifs
        if (event.data.includes("SCAM")) return;

        serverWs.emit("bloxflip-ws-log", `▼─ ${event.data}`);
    });

    bfWs.addEventListener("open", () => {
        Logger.info("BF", "Successfully connected to Bloxflip WebSocket");
    });
}

async function bfWsSend(msg: string) {
    bfWs.send(msg);
    serverWs.emit("bloxflip-ws-log", `─▲ ${msg}`);
}

export { connectServerWs, serverWs, connectBfWs, bfWsSend, bfWs };
