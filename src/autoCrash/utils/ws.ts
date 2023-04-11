import { calculateBet } from "../bloxflip/bet.js";
import { config } from "./config.js";

const bfWs: WebSocket = new WebSocket("wss://ws.bloxflip.com/socket.io/?transport=websocket");

async function connectWs() {    
    bfWs.addEventListener("message", async (event) => {
        if (event.data.charAt(0) == "0") {
            bfWs.send("40/chat,");
            bfWs.send("40/crash,");
        }

        if (event.data == "40/crash") {
            bfWs.send(`42/crash,["auth","${config.auth}"]`);
            console.log("[WS] Connected to WebSocket");
            await calculateBet(true);
        }
    });
}

export { connectWs, bfWs };
