import { connectWs, bfWs } from "./utils/ws.js";
import { fetchCfg } from "./utils/config.js";
import { crash } from "./bloxflip/crash.js";
import { keepAlive } from "./utils/keepAlive.js";
import { sleep } from "../utils/sleep.js";
import { rain } from "./bloxflip/rain.js";

console.log("[BFAC] Running AutoCrash");

async function startCrash() {
    try {
        await fetchCfg();
        await connectWs();

        const kA = new keepAlive();
        
        bfWs.addEventListener("close", async () => {
            console.log("[WS] WebSocket closed unexpectedly, attempting reconnect...");
            await sleep(5000);

            bfWs.removeEventListener("message", crash);
            bfWs.removeEventListener("message", rain);
            kA.stop();

            startCrash();
        });
        
        Promise.all([
            bfWs.addEventListener("message", (event) => crash(event)),
            bfWs.addEventListener("message", (event) => rain(event)),
            kA.start()
        ]);
    } catch (err) {
        console.error(`[BFAC] Error occured, killing AutoCrash. \n${err}`);
    }
} startCrash();
