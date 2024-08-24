import { calculateBet } from "../bloxflip/bet.js";
import { config } from "./config.js";
import { Logger } from "./logger.js";

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
    bfWs = new WebSocket("wss://ws.bloxflip.com/socket.io/?EIO=3&transport=websocket");

    bfWs.addEventListener("message", async (event) => {
        if (event.data.charAt(0) == "0") {
            if (config.rain.enabled) bfWs.send("40/chat,");
            bfWs.send("40/crash,");
        }

        if (event.data == "40/crash") {
            bfWs.send(`42/crash,["auth","${config.auth}"]`);
            Logger.info("WS", "Connected to WebSocket");
            console.log("──────────────────────────────────");
            await calculateBet(true);
        }
    });
}

export { connectWs, bfWs };
