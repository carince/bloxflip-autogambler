import { bfWs } from "./ws.js";
import { sleep } from "../../utils/sleep.js";

async function keepAlive() {
    await sleep(30000);
    bfWs.send("2");
    keepAlive();
}

export { keepAlive };
