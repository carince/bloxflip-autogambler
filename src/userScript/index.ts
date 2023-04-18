import { connectWs, bfWs } from "./utils/ws.js";
import { fetchCfg } from "./utils/config.js";
import { crash } from "./bloxflip/crash.js";
import { keepAlive } from "./utils/keepAlive.js";
import { sleep } from "@utils/sleep.js";
import { startRain, rain } from "./bloxflip/rain.js";
import { Logger } from "./utils/logger.js";

Logger.info("BFAC", "Running AutoCrash");

async function startCrash() {
    try {
        await fetchCfg();
        await connectWs();

        const kA = new keepAlive();
        
        bfWs.addEventListener("close", async () => {
            Logger.warn("WS", "WebSocket closed unexpectedly, attempting reconnect...");
            await sleep(5000);

            bfWs.removeEventListener("message", crash);
            bfWs.removeEventListener("message", rain);
            kA.stop();

            startCrash();
        });
        
        Promise.all([
            bfWs.addEventListener("message", (event) => crash(event)),
            startRain(),
            kA.start()
        ]);
    } catch (err) {
        Logger.error("BFAC", `Error occured, killing AutoCrash. \n${err}`, true);
    }
} startCrash();
