import { bfWsSend } from "./ws.js";
import { sleep } from "@utils/sleep.js";

class keepAlive {
    private enabled: boolean;

    constructor() {
        this.enabled = false;
    }

    async start() {
        this.enabled = true;
        for (let i = 0; i < Infinity; i++) {
            if (this.enabled) {
                try {
                    await sleep(25000);
                    bfWsSend("2");
                } catch { continue; }
            }
        }
    }
    
    async stop() {
        this.enabled = false;
    }
}

export { keepAlive };
