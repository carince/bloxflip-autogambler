import { bfWs } from "./ws.js";
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
                    await sleep(30000);
                    bfWs.send("2");
                } catch { }
            }
        }
    }
    
    async stop() {
        this.enabled = false;
    }
}

export { keepAlive };
