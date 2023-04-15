import { config } from "@utils/config.js";
import { post } from "@utils/pfetch.js";

async function sendWh(json: any): Promise<void> {
    if (config.webhook.enabled) {
        await post(config.webhook.link, JSON.stringify(json));
    }
}

export { sendWh };
