import { config } from "./config";
import { post } from "./pfetch";

async function sendWh(json: any): Promise<void> {
    if (config.webhook.enabled) {
        await post(config.webhook.link, JSON.stringify(json));
    }
}

export { sendWh };