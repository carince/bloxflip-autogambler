import { config } from "./config.js";
import { post } from "./pfetch.js";

async function sendWh(json: any): Promise<void> {
    if (config.webhook.enabled) {
        await post(config.webhook.link, JSON.stringify(json));
    }
}

export { sendWh };
