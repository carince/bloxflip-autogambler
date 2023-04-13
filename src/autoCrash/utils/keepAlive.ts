import { bfWs } from "./ws.js";
import { sleep } from "../../utils/sleep.js";

class keepAlive {
    private isOn: boolean;

    constructor() {
        this.isOn = false;
    }

    async start() {
        this.isOn = true;
        for (let i = 0; i < Infinity; i++) {
            if (this.isOn) {
                try {
                    await sleep(30000);
                    bfWs.send("2");
                } catch { }
            } else {
                return;
            }
        }
    }
    
    async stop() {
        this.isOn = false;
    }
}

export { keepAlive };
